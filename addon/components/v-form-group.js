import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'div',
    class: 'form-group',
    errorClass: 'has-error',
    classNameBindings: ['class', 'error'],
    property: '',

    error: Ember.computed('message', function() {
        if (this.get('message')) return this.get('errorClass');
    }),

    init() {
        this.set('elementId', `v-form-group#${this.get('property')}`);
        this._super(...arguments);
    },

    didInsertElement() {
        const props = this.extractProperties();
        const vForm = this.get('parentView');

        vForm.get('properties').pushObject({
            elementId: this.get('elementId'),
            properties: props,
        });

        props.forEach(prop => vForm.addObserver(`model.${prop}`, this, () => {
            if (this.isDestroying || this.isDestroyed) {
                return;
            }
            this.revalidate();
        }));
    },

    focusIn() {
        this.clearErrors();
    },

    focusOut() {
        this.revalidate();
    },

    clearErrors() {
        this.set('message', undefined);
    },

    revalidate() {
        this.clearErrors();
        const message  = this.get('parentView').validateProperty(this.get('elementId'));
        if (message) this.set('message', message);
    },

    extractProperties() {
        const property = this.get('property');
        const subproperties = property.match(/\[[a-z, ]+\]/i);
        if (!subproperties) return [property];
        const [parentProp, childProps] = property.split('.');
        return subproperties[0].split(/[^\w]/i)
                               .filter(Boolean)
                               .map(word => childProps && `${parentProp}.${word}` || word);
    },
});
