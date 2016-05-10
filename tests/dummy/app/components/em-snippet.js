import Ember from 'ember';
/* global hljs */
export default Ember.Component.extend({
    tagName: 'pre',
    classNameBindings: ['lang'],

    didInsertElement: function() {
        const highlighted = hljs.highlight(this.get('lang'), Ember.$(this.get('element')).html());
        Ember.$(this.get('element')).empty();
        console.log(highlighted);
        Ember.$(this.get('element')).html(highlighted.value);
    },
});
