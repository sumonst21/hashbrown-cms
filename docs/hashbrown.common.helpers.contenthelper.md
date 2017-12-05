---
comment: "/**\n * A helper class for Content\n *\n * @memberof HashBrown.Common.Helpers\n */"
meta:
    range:
        - 94
        - 4168
    filename: ContentHelper.js
    lineno: 8
    columnno: 0
    path: /home/mrzapp/Development/Web/hashbrown-cms/src/Common/Helpers
    code:
        id: astnode100043755
        name: ContentHelper
        type: ClassDeclaration
        paramnames: []
classdesc: 'A helper class for Content'
memberof: HashBrown.Common.Helpers
name: ContentHelper
longname: HashBrown.Common.Helpers.ContentHelper
kind: class
scope: static
methods:
    -
        comment: "/**\n     * Gets all Content objects\n     *\n     * @param {String} project\n     * @param {String} environment\n     *\n     * @return {Promise} promise\n     */"
        meta:
            range:
                - 281
                - 471
            filename: ContentHelper.js
            lineno: 17
            columnno: 4
            path: /home/mrzapp/Development/Web/hashbrown-cms/src/Common/Helpers
            code:
                id: astnode100043758
                name: ContentHelper.getAllContents
                type: MethodDefinition
                paramnames:
                    - project
                    - environment
            vars:
                "": null
        description: 'Gets all Content objects'
        params:
            -
                type:
                    names:
                        - String
                name: project
            -
                type:
                    names:
                        - String
                name: environment
        returns:
            -
                type:
                    names:
                        - Promise
                description: promise
        name: getAllContents
        longname: HashBrown.Common.Helpers.ContentHelper.getAllContents
        kind: function
        memberof: HashBrown.Common.Helpers.ContentHelper
        scope: static
    -
        comment: "/**\n     * Gets a URL-friendly version of a string\n     *\n     * @param {String} string\n     *\n     * @param {String} slug\n     */"
        meta:
            range:
                - 612
                - 956
            filename: ContentHelper.js
            lineno: 31
            columnno: 4
            path: /home/mrzapp/Development/Web/hashbrown-cms/src/Common/Helpers
            code:
                id: astnode100043781
                name: ContentHelper.getSlug
                type: MethodDefinition
                paramnames:
                    - string
            vars:
                "": null
        description: 'Gets a URL-friendly version of a string'
        params:
            -
                type:
                    names:
                        - String
                name: string
            -
                type:
                    names:
                        - String
                name: slug
        name: getSlug
        longname: HashBrown.Common.Helpers.ContentHelper.getSlug
        kind: function
        memberof: HashBrown.Common.Helpers.ContentHelper
        scope: static
    -
        comment: "/**\n     * Gets a Content object by id\n     *\n     * @param {String} project\n     * @param {String} environment\n     * @param {String} id\n     *\n     * @return {Promise} promise\n     */"
        meta:
            range:
                - 1152
                - 1384
            filename: ContentHelper.js
            lineno: 53
            columnno: 4
            path: /home/mrzapp/Development/Web/hashbrown-cms/src/Common/Helpers
            code:
                id: astnode100043828
                name: ContentHelper.getContentById
                type: MethodDefinition
                paramnames:
                    - project
                    - environment
                    - id
            vars:
                "": null
        description: 'Gets a Content object by id'
        params:
            -
                type:
                    names:
                        - String
                name: project
            -
                type:
                    names:
                        - String
                name: environment
            -
                type:
                    names:
                        - String
                name: id
        returns:
            -
                type:
                    names:
                        - Promise
                description: promise
        name: getContentById
        longname: HashBrown.Common.Helpers.ContentHelper.getContentById
        kind: function
        memberof: HashBrown.Common.Helpers.ContentHelper
        scope: static
    -
        comment: "/**\n     * Sets a Content object by id\n     *\n     * @param {String} project\n     * @param {String} environment\n     * @param {String} id\n     * @param {Content} content\n     *\n     * @return {Promise} promise\n     */"
        meta:
            range:
                - 1616
                - 1974
            filename: ContentHelper.js
            lineno: 71
            columnno: 4
            path: /home/mrzapp/Development/Web/hashbrown-cms/src/Common/Helpers
            code:
                id: astnode100043858
                name: ContentHelper.setContentById
                type: MethodDefinition
                paramnames:
                    - project
                    - environment
                    - id
                    - content
            vars:
                "": null
        description: 'Sets a Content object by id'
        params:
            -
                type:
                    names:
                        - String
                name: project
            -
                type:
                    names:
                        - String
                name: environment
            -
                type:
                    names:
                        - String
                name: id
            -
                type:
                    names:
                        - Content
                name: content
        returns:
            -
                type:
                    names:
                        - Promise
                description: promise
        name: setContentById
        longname: HashBrown.Common.Helpers.ContentHelper.setContentById
        kind: function
        memberof: HashBrown.Common.Helpers.ContentHelper
        scope: static
    -
        comment: "/**\n     * Checks if a Schema type is allowed as a child of a Content object\n     *\n     * @param {String} project\n     * @param {String} environment\n     * @param {String} parentId\n     * @param {String} childSchemaId\n     *\n     * @returns {Promise} Is the Content node allowed as a child\n     */"
        meta:
            range:
                - 2283
                - 3701
            filename: ContentHelper.js
            lineno: 92
            columnno: 4
            path: /home/mrzapp/Development/Web/hashbrown-cms/src/Common/Helpers
            code:
                id: astnode100043904
                name: ContentHelper.isSchemaAllowedAsChild
                type: MethodDefinition
                paramnames:
                    - project
                    - environment
                    - parentId
                    - childSchemaId
            vars:
                "": null
        description: 'Checks if a Schema type is allowed as a child of a Content object'
        params:
            -
                type:
                    names:
                        - String
                name: project
            -
                type:
                    names:
                        - String
                name: environment
            -
                type:
                    names:
                        - String
                name: parentId
            -
                type:
                    names:
                        - String
                name: childSchemaId
        returns:
            -
                type:
                    names:
                        - Promise
                description: 'Is the Content node allowed as a child'
        name: isSchemaAllowedAsChild
        longname: HashBrown.Common.Helpers.ContentHelper.isSchemaAllowedAsChild
        kind: function
        memberof: HashBrown.Common.Helpers.ContentHelper
        scope: static
    -
        comment: "/**\n     * Creates a new content object\n     *\n     * @return {Promise} promise\n     */"
        meta:
            range:
                - 3799
                - 3914
            filename: ContentHelper.js
            lineno: 129
            columnno: 4
            path: /home/mrzapp/Development/Web/hashbrown-cms/src/Common/Helpers
            code:
                id: astnode100044035
                name: ContentHelper.createContent
                type: MethodDefinition
                paramnames: []
            vars:
                "": null
        description: 'Creates a new content object'
        returns:
            -
                type:
                    names:
                        - Promise
                description: promise
        name: createContent
        longname: HashBrown.Common.Helpers.ContentHelper.createContent
        kind: function
        memberof: HashBrown.Common.Helpers.ContentHelper
        scope: static
        params: []
    -
        comment: "/**\n     * Removes a content object\n     *\n     * @param {Number} id\n     *\n     * @return {Promise} promise\n     */"
        meta:
            range:
                - 4045
                - 4166
            filename: ContentHelper.js
            lineno: 142
            columnno: 4
            path: /home/mrzapp/Development/Web/hashbrown-cms/src/Common/Helpers
            code:
                id: astnode100044049
                name: ContentHelper.removeContentById
                type: MethodDefinition
                paramnames:
                    - id
            vars:
                "": null
        description: 'Removes a content object'
        params:
            -
                type:
                    names:
                        - Number
                name: id
        returns:
            -
                type:
                    names:
                        - Promise
                description: promise
        name: removeContentById
        longname: HashBrown.Common.Helpers.ContentHelper.removeContentById
        kind: function
        memberof: HashBrown.Common.Helpers.ContentHelper
        scope: static
shortname: ContentHelper
layout: docPage
permalink: /docs/hashbrown/common/helpers/contenthelper/
title: 'API: ContentHelper'
description: 'A helper class for Content'

---