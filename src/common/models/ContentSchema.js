'use strict';

let Schema = require('./Schema');

/**
 * Schema for content nodes
 */
class ContentSchema extends Schema {
    structure() {
        super.structure();

        this.def(String, 'defaultTabId');
        this.def(Object, 'tabs', {});
        this.def(Object, 'fields', {});
        this.def(Array, 'allowedChildSchemas', []);

        this.name = 'New content schema';
        this.type = 'content';
    }
}

module.exports = ContentSchema;