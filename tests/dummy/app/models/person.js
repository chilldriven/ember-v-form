import DS from 'ember-data';
import Validator from '../mixins/model-validator';

export default DS.Model.extend(Validator, {
    name: DS.attr('string'),
    validations: {
      name: {
          presence: true
      }
  }
});
