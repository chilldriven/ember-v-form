import Ember from 'ember';
import _ from 'lodash';

export default Ember.Component.extend({
  tagName: 'div',
  class: 'form-group',
  classNameBindings: ['class', 'inValid:hasError'],
  property: '',
  valid: Ember.computed.not('message'),
  inValid: Ember.computed.bool('message'),
  didInsertElement() {
    const html  = Ember.$(this.element),
          input = Ember.$('input, textarea, select', html),
          properties = this.extractProperties();

    if (input) {
      input.on('focus', this.clearErrors.bind(this));
      input.on('blur', this.revalidate.bind(this));
    }

    if (this.get('hardWatch')) html.on('focusout', this.revalidate.bind(this));
    this.get('parentView.properties').push(properties);
    _.each(properties, (property) => {
      this.get('parentView')
          .addObserver(`model.${property}`, this, this.revalidate.bind(this));
    });
  },

  clearErrors() {
    this.set('message', undefined);
  },

  revalidate() {
    this.set('message', this.get('parentView').validateProperty(this.get('property')));
  },

  extractProperties() {
    const id = this.get('elementId');
    let properties    = [this.get('property')],
        subproperties = properties[0].match(/\[[a-z, ]+\]/i);
    if (subproperties) {
      const [parentProp, childProps] = properties[0].split('.');
      subproperties = _.words(subproperties[0]);
      properties    = _.map(subproperties, w => {
        if (childProps) return `${parentProp}.${w}`;
        return w;
      });
    }

    return {id, properties};
  },
});
