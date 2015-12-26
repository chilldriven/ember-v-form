import Ember from 'ember';
import _ from 'lodash';

export default Ember.Component.extend({
  tagName: 'form',
  class: 'form-horizontal',
  classNameBindings: ['class'],
  attributeBindings: ['action'],
  properties: [],
  action: 'submit',
  submitButtonClass: 'btn btn-primary',
  submitText: 'Submit',
  cancelButtonClass: 'btn btn-default',
  cancelText: 'Cancel',

  notifyGroup(id, property, message='', revalidate=true) {
    const group = _.detect(this.get('childViews'), c => c.get('elementId') === id);
    if (!message && !revalidate) message = this.getMessage(property);
    if (revalidate) message = this.validateProperty(property);
    group.set('message', message);
  },

  validateProperty(propertyKey) {
    this.get('model').validate({only: propertyKey});
    return this.getMessage(propertyKey);
  },

  getMessage(propertyKey) {
    const errorObject = _.detect(this.get('model.errors.content'), 'attribute', propertyKey);
    return _.get(errorObject, 'message[0]', '');
  },

  submit(e) {
    if (e) {
      e.preventDefault();
    }

    const bool = this.get('model').validate(),
    errors = this.get('model.errors.content');
    if (bool) return this.sendAction('submitAction');
    _.each(errors, e => {
      const propObject = _.detect(this.get('properties'), p => {
        if (e) return _.contains(p.properties, e.attribute);
      });
      if (propObject) this.notifyGroup(propObject.id, e.attribute, e.message, false);
    });
  },

  actions: {
    cancel() {
      this.sendAction('cancelAction');
    },
  },

});
