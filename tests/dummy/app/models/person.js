import DS from 'ember-data';
import Validator from '../mixins/model-validator';

export default DS.Model.extend(Validator, {
    name: DS.attr('string'),
    password: DS.attr('string'),
    accepted: DS.attr('boolean'),
    color: DS.attr('string'),
    gender: DS.attr('string'),
    address: DS.attr({defaultValue() {
        return {};
    }}),

    validations: {
        name: {
            presence: true
        },
        gender: {
            inclusion: {in: ['m', 'f', 'n']}
        },
        password: {
            presence: true
        },
        color: {
            color: true
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
