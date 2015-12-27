import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'form',
    classNames: ['form-horizontal'],
    classNameBindings: ['class'],
    attributeBindings: ['action'],
    properties: [],
    action: 'submit',
    submitButtonClass: 'btn btn-primary',
    submitText: 'Submit',
    cancelButtonClass: 'btn btn-default',
    cancelText: 'Cancel',

    notifyGroup(id, property, message='', revalidate=true) {
        const chilViews = this.get('childViews'),
              group     = _.detect(chilViews, c => c.get('elementId') === id);
        if (!message && !revalidate) message = this.getMessage(property);
        if (revalidate)              message = this.validateProperty(property);
        group.set('message', message);
    },

    validateProperty(propertyKey) {
        this.get('model').validate({only: propertyKey});
        return this.getMessage(propertyKey);
    },

    getMessage(propertyKey) {
        const errors      = this.get('model.errors.content'),
              errorObject = _.detect(errors, 'attribute', propertyKey);
        return _.get(errorObject, 'message[0]', '');
    },

    submit(e) {
        if (e) e.preventDefault();
        const bool   = this.get('model').validate(),
              errors = this.get('model.errors.content');
        if (bool) return this.sendAction('submitAction');
        _.each(errors, e => {
            const id = _.result(_.detect(this.get('properties'), p => {
                if (e) return _.contains(p.properties, e.attribute);
            }), 'id');
            if (id) this.notifyGroup(id, e.attribute, e.message, false);
        });
    },

    actions: {
        cancel() {
            this.sendAction('cancelAction');
        }
    }

});
