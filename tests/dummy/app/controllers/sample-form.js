import Ember from 'ember';

/* eslint no-alert: 0 */
export default Ember.Controller.extend({
    numbers: [
        {id: 1, text: 'I'},
        {id: 2, text: 'II'},
        {id: 3, text: 'III'},
        {id: 4, text: 'IV'},
        {id: 5, text: 'V'},
        {id: 6, text: 'VI'},
        {id: 7, text: 'VII'},
        {id: 8, text: 'VIII'},
        {id: 9, text: 'IX'},
    ],
    separators: [',', ' ', '.'],
    actions: {
        submit() {
            window.alert('submitted');
        },
    },
    sampleModel: `
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
    `,
});
