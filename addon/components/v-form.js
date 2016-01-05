import Ember from 'ember';
import _ from 'lodash/lodash';

export default Ember.Component.extend({
    tagName: 'form',
    class: 'form-horizontal',
    classNameBindings: ['class'],
    attributeBindings: ['action'],
    properties: Ember.A([]),
    action: 'submit',
    submitButtonClass: 'btn btn-primary',
    submitText: 'Submit',
    cancelButtonClass: 'btn btn-default',
    cancelText: 'Cancel',
    disableInvalidSubmission: true,

    errors: Ember.computed.mapBy('model.errors.content', 'attribute'),
    valid: Ember.computed.and('model.hasDirtyAttributes', 'model.isValidNow'),
    invalid: Ember.computed.not('valid'),

    init() {
        this._super(...arguments);
        this.get('model').validate();
    },

    notifyGroup(elementId, property, message='', revalidate=true) {
        const childViews = this.get('childViews'),
              group     = _.detect(childViews, c => c.get('elementId') === elementId);
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

    clearAll() {
        const childViews = this.get('childViews'),
              properties = this.get('properties');
        _.each(properties, p => {
            const group = _.detect(childViews, c => c.get('elementId') === p.elementId);
            if (group) group.clearErrors();
        });
    },

    submit(e) {
        if (e) e.preventDefault();
        this.clearAll();
        const bool   = this.get('model').validate(),
              errors = this.get('model.errors.content');
        if (bool) return this.sendAction('submitAction');
        _.each(errors, err => {
            const elementId = _.result(_.detect(this.get('properties'), p => {
                if (err) return _.contains(p.properties, err.attribute);
            }), 'elementId');
            if (elementId) this.notifyGroup(elementId, err.attribute, err.message, false);
        });
    }
});
