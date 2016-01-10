import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'button',
    class: 'btn btn-primary',
    classNameBindings: ['class'],
    attributeBindings: ['type', 'disabled'],
    disableInvalidSubmission: true,

    type: 'submit',
    disabled: Ember.computed.and('disableInvalidSubmission', 'parentView.invalid')
});
