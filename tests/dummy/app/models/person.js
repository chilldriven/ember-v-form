import DS from 'ember-data';
import Validator from '../mixins/model-validator';

export default DS.Model.extend(Validator, {
    name: DS.attr('string'),
    password: DS.attr('string'),
    accepted: DS.attr('boolean'),
    address: DS.attr(),
    validations: {
        name: {
            presence: true
        },
        password: {
            presence: true
        },
        accepted: {
            acceptance: true
        },
        'address.city': {
            presence: true
        },
        'address.street': {
            presence: true
        }
    }
});
