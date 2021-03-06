'use strict';

const Path = require('path');
const FileSystem = require('fs');

// TODO: Make these GIT submodules
const RimRaf = require('rimraf');
const Multer = require('multer');
const Glob = require('glob');

const MediaHelperCommon = require('Common/Helpers/MediaHelper');

const WATCH_CACHE_INTERVAL = 1000 * 60; // One minute
const MAX_CACHE_TIME = 1000 * 60 * 60 * 24 * 10 // 10 days

/**
 * The helper class for Media
 *
 * @memberof HashBrown.Server.Helpers
 */
class MediaHelper extends MediaHelperCommon {
    /**
     * Start watching cache
     */
    static startWatchingCache() {
        setInterval(() => {
            this.cleanCache();
        }, WATCH_CACHE_INTERVAL);

        this.cleanCache();
    }
    
    /**
     * Gets the upload handler
     *
     * @param {Boolean} isSingleFile
     *
     * @return {Function} handler
     */
    static getUploadHandler(isSingleFile) {
        let handler = Multer({
            storage: Multer.diskStorage({
                destination: (req, file, resolve) => {
                    let path = MediaHelper.getTempPath(req.project);
                   
                    debug.log('Handling file upload to temp storage...', this);

                    if(!FileSystem.existsSync(path)){
                        this.mkdirRecursively(path, () => {
                            resolve(null, path);
                        });
                    
                    } else {
                        resolve(null, path);

                    }
                },
                filename: (req, file, resolve) => {
                    resolve(null, file.originalname);
                }
            })
        })
       
        if(isSingleFile) {
            return handler.single('media');
        } else {
            return handler.array('media', 100);
        }
    }

    /**
     * Makes a directory recursively
     *
     * @param {String} dirPath
     * @param {Function} callback
     * @param {Number} position
     */
    static mkdirRecursively(dirPath, callback = null, position = 0) {
        checkParam(dirPath, 'dirPath', String);
        
        let parts = Path.normalize(dirPath).split(Path.sep);
        
        if(position >= parts.length) {      
            if(callback) {
                callback();
            }
            
            return;
        }
        
        let currentDirPath = parts.slice(0, position + 1).join(Path.sep);
          
        if(currentDirPath) {
            if(!FileSystem.existsSync(currentDirPath)) {
                FileSystem.mkdirSync(currentDirPath);
            }
        }
        
        MediaHelper.mkdirRecursively(dirPath, callback, position + 1);
    }
    
    /**
     * Renames a Media object
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     * @param {String} name
     *
     * @return {Promise} Promise
     */
    static renameMedia(project, environment, id, name) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(id, 'id', String);
        checkParam(name, 'name', String);

        // Get Media provider
        return HashBrown.Helpers.ConnectionHelper.getMediaProvider(project, environment)
        .then((provider) => {
            return provider.renameMedia(id, name);
        });
    }
    
    /**
     * Uploads a file from temp storage
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     * @param {String} tempPath
     *
     * @returns {Promise} Result
     */
    static uploadFromTemp(project, environment, id, tempPath) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(id, 'id', String);
        checkParam(tempPath, 'tempPath', String);

        let connection;
        let filename = Path.basename(tempPath);

        // Get Media provider
        return HashBrown.Helpers.ConnectionHelper.getMediaProvider(project, environment)
        .then((provider) => {
            connection = provider;

            // Read the file from temp
            debug.log('Reading file from temp dir ' + tempPath + '...', this);

            return new Promise((resolve, reject)  => {
                FileSystem.readFile(tempPath, (err, fileData) => {
                    if(err) { return reject(err); }

                    resolve(fileData);
                });
            });
        })
        .then((fileData) => {
            // Upload the data
            debug.log('Uploading file...', this);
            
            return connection.setMedia(id, filename, fileData.toString('base64'));
        })
        .then(() => {
            // Remove the file from temp storage
            debug.log('Removing temp file...', this);
            
            return new Promise((resolve, reject)  => {
                FileSystem.unlink(tempPath, (err) => {
                    resolve();
                });
            });
        });
    }

    /**
     * Gets the Media tree
     *
     * NOTE: This method, as opposed to most other resource methods, does not merge
     * local and remote resources since it would be too complicated in the end
     *
     * @param {String} project
     * @param {String} environment
     *
     * @return {Promise} Tree
     */
    static getTree(project, environment) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);

        let collection = environment + '.media';
       
        return HashBrown.Helpers.SyncHelper.getResource(project, environment, 'media/tree')
        .then((tree) => {
            if(!tree || tree.length < 1) {
                return HashBrown.Helpers.DatabaseHelper.find(project, environment + '.media', {});
            }

            return Promise.resolve(tree);   
        })
        .then((tree) => {
            // Make sure there is a root folder
            tree.unshift({folder: '/', id: '*'});

            // Path sanity check
            for(let item of tree) {
                item.folder = item.folder || '/'; 

                // Append initial slash
                if(item.folder.indexOf('/') !== 0) {
                    item.folder = '/' + item.folder;
                }

                // Append end slash
                item.folder = item.folder + '/';

                // Replace all double slashes with a single slash
                item.folder = item.folder.replace(/\/+/g, '/');
            }

            return Promise.resolve(tree);
        });
    }
    
    /**
     * Sets a Media tree parent
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     * @param {Object} item
     *
     * @return {Promise} promise
     */
    static setTreeItem(project, environment, id, item) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(id, 'id', String);
        checkParam(item, 'item', Object);

        return HashBrown.Helpers.SyncHelper.setResourceItem(project, environment, 'media/tree', id, item)
        .then((wasItemSet) => {
            if(wasItemSet) { return Promise.resolve(); }        

            // Remove the item if it's null
            if(!item) {
                return HashBrown.Helpers.DatabaseHelper.removeOne(
                    project,
                    environment + '.media',
                    {
                        id: id
                    }
                );

            // If it's not, update the database document
            } else {
                item.id = id;

                return HashBrown.Helpers.DatabaseHelper.updateOne(
                    project,
                    environment + '.media',
                    {
                        id: id
                    },
                    item,
                    {
                        upsert: true
                    }
                );
            }
        })
    }
    
    /**
     * Gets the media temp path
     *
     * @param {String} project
     *
     * @returns {String} path
     */
    static getTempPath(project) {
        checkParam(project, 'project', String);

        return Path.join(APP_ROOT, 'storage', project, 'temp');
    }

    /**
     * Cleans the Media cache
     */
    static cleanCache() {
        let storageFolder = Path.join(APP_ROOT, 'storage');
       
        if(!FileSystem.existsSync(storageFolder)) { return; }

        FileSystem.readdir(storageFolder, (err, folders) => {
            if(err) { return; }
        
            for(let folder of folders) { 
                let cacheFolder = Path.join(storageFolder, folder, 'cache');

                if(!FileSystem.existsSync(cacheFolder)) { continue; }

                FileSystem.readdir(cacheFolder, (err, files) => {
                    if(err) { return; }
                    
                    for(let file of files) {
                        let cachedFile = Path.join(cacheFolder, file);

                        FileSystem.stat(cachedFile, (err, stats) => {
                            if(err) { return; }

                            if(new Date().getTime() - new Date(stats.atime).getTime() > MAX_CACHE_TIME) {
                                FileSystem.unlink(cachedFile, (err) => { });
                            }
                        });
                    }
                });
            }
        });
    }

    /**
     * Removes a cached version of a Media object
     *
     * @param {String} project
     * @param {String} id
     * 
     * @return {Promise} Result
     */
    static removeCachedMedia(project, id) {
        checkParam(project, 'project', String);
        checkParam(id, 'id', String);

        let cacheFolder = Path.join(APP_ROOT, 'storage', project, 'cache');
        let cachedPath = Path.join(cacheFolder, id);
     
        return HashBrown.Helpers.FileHelper.remove(cachedPath + '*');
    }


    /**
     * Gets a cached version of a Media object
     *
     * @param {String} project
     * @param {Media} media
     * @param {Number} width
     * @param {Number} height
     *
     * @returns {Promise} Media
     */
    static getCachedMedia(project, media, width = 0, height = 0) {
        checkParam(project, 'project', String);
        checkParam(media, 'media', HashBrown.Models.Media);
        checkParam(width, 'width', Number);
        checkParam(height, 'height', Number);

        let cacheFolder = Path.join(APP_ROOT, 'storage', project, 'cache');
        let cachedPath = Path.join(cacheFolder, media.id);
        
        if(width) {
            cachedPath += '_' + width;
        }
        
        if(height) {
            cachedPath += 'x' + height;
        }

        // Check the cache folder
        if(!FileSystem.existsSync(cacheFolder)) {
            FileSystem.mkdirSync(cacheFolder);
        }

        // Read the file
        let readFile = () => {
            return new Promise((resolve, reject) => {
                FileSystem.readFile(cachedPath, (err, data) => {
                    if(err) { return reject(err); }

                    resolve(data);
                });
            });
        };

        // Copy the file
        let copyFile = () => {
            // Download with web request
            if(media.url) {
                return HashBrown.Helpers.RequestHelper.download(media.url, path);
            }

            // Copy from file system
            return new Promise((resolve, reject) => {
                FileSystem.copyFile(media.path, cachedPath, (err) => {
                    if(err) { return reject(err); }

                    resolve();
                });
            });
        };

        // Resize the file
        let resizeFile = () => {
            if(!width || !media.isImage() || media.isSvg()) { 
                return Promise.resolve();
            }
            
            return HashBrown.Helpers.AppHelper.exec('convert ' + cachedPath + ' -resize ' + width + (height ? 'x' + height : '') + '\\> ' + cachedPath);
        };

        // Check the file
        let checkFile = () => {
            if(FileSystem.existsSync(cachedPath)) {
                return Promise.resolve();

            } else {
                return copyFile()
                .then(resizeFile);
            }
        };

        return checkFile()
        .then(readFile);
    }
}

module.exports = MediaHelper;
