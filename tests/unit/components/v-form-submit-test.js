import { expect } from 'chai';
import { describeComponent } from 'ember-mocha';
import { describe, it, beforeEach } from 'mocha';
import Ember from 'ember';

describeComponent(
    'v-form-submit',
    'VFormSubmitComponent', {
        // Specify the other units that are required for this test
        needs: ['component:v-form']
    },
    function() {
        describe('rendering', function() {
            beforeEach(function() {
                this.component = this.subject();
                expect(this.component._state).to.equal('preRender');
                this.render();
                this.element = Ember.$(this.component.element);
            });

            it('renders with proper classname', function() {
                expect(this.component._state).to.equal('inDOM');
                expect(this.element.hasClass('btn')).to.be.ok;
            });
        });

        describe('attribute assignment', function() {
            beforeEach(function() {
                this.component = this.subject({
                    parentView: Ember.Object.create({})
                });
                this.render();
                this.element = Ember.$(this.component.element);
            });

            it('is enabled if disableInvalidSubmission is off', function() {
                Ember.run(() => this.component.setProperties({
                    'parentView.disableInvalidSubmission': false,
                    'parentView.invalid': true
                }));
                expect(this.component.get('disabled')).to.not.be.ok;
                expect(this.element.attr('disabled')).to.not.be.ok;
            });

            it('is enabled if form is valid', function() {
                Ember.run(() => this.component.setProperties({
                    'parentView.disableInvalidSubmission': true,
                    'parentView.invalid': false
                }));
                expect(this.component.get('disabled')).to.not.be.ok;
                expect(this.element.attr('disabled')).to.not.be.ok;
            });

            it('is disabled if disableInvalidSubmission is on and form is invalid', function() {
                Ember.run(() => this.component.setProperties({
                    'parentView.disableInvalidSubmission': true,
                    'parentView.invalid': true
                }));
                expect(this.component.get('disabled')).to.be.ok;
                expect(this.element.attr('disabled')).to.be.ok;
            });
        });
    }
);
