import Ember from 'ember';

export default Ember.Controller.extend({
    genders: [{id: 'm', text: 'male'}, {id: 'f', text: 'female'}, {id: 'n', text: 'rather not say'}],

    actions: {
        submit() {
            console.log('submitted');
        }
    }
});
