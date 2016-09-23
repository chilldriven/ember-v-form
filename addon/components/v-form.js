import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'form',
    class: 'form-horizontal',
    submitAction: 'submit',
    classNameBindings: ['class'],
    attributeBindings: ['action'],
    properties: Ember.A([]),
    action: 'submit',

    errors:  Ember.computed.mapBy('model.errors', 'attribute'),
    valid:   Ember.computed.and('model.hasDirtyAttributes', 'model.isValidNow'),
    invalid: Ember.computed.not('valid'),

    init() {
        this.get('model').validate();
        this._super(...arguments);
    },

    notifyGroup(elementId, property, message = '', revalidate = true) {
        const group = this.get('childViews').findBy('elementId', elementId);
        if (!message && !revalidate) message = this.getMessage(property);
        if (revalidate) message = this.validateProperty(elementId);
        group.set('message', message);
    },

    validateProperty(elementId) {
        const p = this.get('properties').findBy('elementId', elementId);
        this.get('model').validate({only: p.properties});
        return this.getMessage(p.properties[0]);
    },

    getMessage(propertyKey) {
        const errors = this.get('model.errors');
        const errorObject = errors.findBy('attribute', propertyKey);
        if (!errorObject) return '';
        return Ember.get(errorObject, 'message')[0] || '';
    },

    clearAll() {
        const childViews = this.get('childViews');
        const properties = this.get('properties');
        properties.forEach(p => {
            const group = childViews.findBy('elementId', p.elementId);
            if (group) group.clearErrors();
        });
    },

    submit(e) {
        if (e) e.preventDefault();
        this.clearAll();
        const bool = this.get('model').validate();
        const errors = this.get('model.errors');
        if (bool) return this.sendAction('submitAction');
        errors.forEach(err => {
            if (!err) return;
            const property  = this.get('properties').find(p => Ember.A(p.properties).contains(err.attribute));
            if (property) {
                const elementId = Ember.get(property, 'elementId');
                if (elementId) this.notifyGroup(elementId, err.attribute, err.message, false);
            }
        });
    },
});
