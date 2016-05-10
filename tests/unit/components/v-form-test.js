import sinon from 'sinon';
import {expect} from 'chai';
import {describeComponent} from 'ember-mocha';
import {describe, it, beforeEach} from 'mocha';

import hbs from 'htmlbars-inline-precompile';
import DS from 'ember-data';
import Ember from 'ember';

/* eslint max-nested-callbacks: 0 */
const defaultAttrs = Ember.A('name password accepted address.street address.city'.split(' '));

function getStore(thisArg) {
    const store = DS.Store.extend({
        adapter: DS.MochaAdapter,
    });

    return store.create({
        container: thisArg.container,
    });
}

const template = hbs `
    {{#v-form-group property="name"}}
        {{input value=model.name}}
    {{/v-form-group}}
    {{#v-form-group property="password"}}
        {{input value=model.password}}
    {{/v-form-group}}
    {{#v-form-group property="accepted"}}
        {{input checked=model.accepted type="checkbox"}}
    {{/v-form-group}}
    {{#v-form-group property="address.[city, street]"}}
        {{input value=model.address.city}}
        {{input value=model.address.street}}
    {{/v-form-group}}
    {{#v-form-submit}}
        Submit
    {{/v-form-submit}}
`;

describeComponent(
    'v-form',
    'VFormComponent',
    {
        needs: [
            'component:v-form',
            'component:v-form-group',
            'component:v-form-submit',
            'model:person',
        ],
    },
    function() {
        describe('rendering', function() {
            beforeEach(function() {
                const formParams = {template: template};
                Ember.run(() => {
                    const store = getStore(this);
                    Ember.set(formParams, 'model', store.createRecord('person'));
                });
                this.form = this.subject(formParams);
                expect(this.form._state).to.equal('preRender');
                this.render();
            });

            it('renders with proper classname and children', function() {
                expect(this.form._state).to.equal('inDOM');
                expect(this.form.childViews.every(cv => cv._state === 'inDOM')).to.be.ok;
                expect(Ember.$(this.form.element).hasClass('form-horizontal')).to.be.ok;
            });

            it('has property array filled and observers defined', function() {
                const formAttrs = this.form.properties
                                      .map(p => p.properties)
                                      .reduce((a1, a2) => a1.concat(a2), []);
                expect(defaultAttrs.every(e => Ember.A(formAttrs).contains(e))).to.be.ok;
                expect(formAttrs.every(e => defaultAttrs.contains(e))).to.be.ok;
                expect(defaultAttrs.every(a => this.form.hasObserverFor(`model.${a}`))).to.be.ok;
            });
        });

        describe('submission', function() {
            describe('on invalid form', function() {
                beforeEach(function() {
                    const formParams = {template: template};
                    Ember.run(() => {
                        const store = getStore(this);
                        Ember.set(formParams, 'model', store.createRecord('person'));
                    });

                    this.form = this.subject(formParams);
                    this.sendAction = sinon.spy(this.form, 'sendAction');
                    this.validate   = sinon.spy(this.form.model, 'validate');

                    this.render();
                });

                it('calls full model validation', function() {
                    Ember.$(this.form.element).trigger('submit');
                    expect(this.validate.calledWith()).to.be.ok;
                });

                it('assigns errors on each invalid property', function() {
                    Ember.$(this.form.element).trigger('submit');
                    const errors = Ember.A(this.form.get('errors'));
                    expect(defaultAttrs.every(e => errors.contains(e))).to.be.ok;
                    expect(errors.every(e => defaultAttrs.contains(e))).to.be.ok;
                });

                it('clears errors on each valid property', function() {
                    Ember.run(() => {
                        this.form.model.set('name', 'some name');
                        this.form.model.set('address', {city: 'some city'});
                    });

                    Ember.$(this.form.element).trigger('submit');
                    const errors   = Ember.A(this.form.get('errors'));
                    const messages = this.form.childViews.mapBy('message');
                    expect(errors.contains('name')).to.not.be.ok;
                    expect(errors.contains('address.city')).to.not.be.ok;
                    expect(messages.filter(Boolean)).to.have.length(3);
                });

                it('has invalid property set to true', function() {
                    Ember.$(this.form.element).trigger('submit');
                    expect(this.form.get('invalid')).to.be.ok;
                });

                it('does not send submit action', function() {
                    Ember.$(this.form.element).trigger('submit');
                    expect(this.sendAction.neverCalledWith('submitAction')).to.be.ok;
                });
            });

            describe('on valid form', function() {
                beforeEach(function() {
                    const formParams = {template: template};
                    Ember.run(() => {
                        const store = getStore(this);
                        Ember.set(formParams, 'model', store.createRecord('person', {
                            name: 'some name',
                            address: {city: 'some city', street: 'some street'},
                            password: 'some password',
                            accepted: true,
                        }));
                    });
                    this.form = this.subject(formParams);
                    this.sendAction = sinon.spy(this.form, 'sendAction');
                    this.validate   = sinon.spy(this.form.model, 'validate');
                    this.render();
                });

                it('calls full model validation', function() {
                    Ember.$(this.form.element).trigger('submit');
                    expect(this.validate.calledWith()).to.be.ok;
                });

                it('does not assign errors to any property', function() {
                    Ember.$(this.form.element).trigger('submit');
                    const errors   = this.form.get('errors'),
                        messages = this.form.childViews.mapBy('message');
                    expect(errors).to.have.length(0);
                    expect(messages.filter(Boolean)).to.have.length(0);
                });

                it('has invalid property set to false', function() {
                    Ember.$(this.form.element).trigger('submit');
                    expect(this.form.get('invalid')).to.not.be.ok;
                });

                it('sends submitAction', function() {
                    Ember.$(this.form.element).trigger('submit');
                    expect(this.sendAction.calledWith('submitAction')).to.be.ok;
                });
            });
        });

        describe('observing model changes', function() {
            beforeEach(function() {
                const formParams = {template: template};
                Ember.run(() => {
                    const store = getStore(this);
                    Ember.set(formParams, 'model', store.createRecord('person'));
                });
                this.form = this.subject(formParams);
                this.validation = sinon.spy(this.form.model, 'validate');
                this.render();
            });
            //
            // it('calls validation only on changed property', function() {
            //     Ember.run(() => this.form.model.set('name', 'a name'));
            //     expect(this.validation.lastCall.args).to.have.length(1);
            //     expect(this.validation.lastCall.args[0].only[0]).to.eq('name');
            // });
            //
            // it('sets and unsets invalid flag properly', function() {
            //     Ember.run(() => this.form.model.set('name', ''));
            //     expect(this.form.get('invalid')).to.be.ok;
            //     Ember.run(() => this.form.model.set('name', 'a name'));
            //     expect(this.form.get('invalid')).to.not.be.ok;
            // });

            it('sets and unsets message on associated v-form-group properly', function() {
                const group = this.form.childViews.findBy('elementId', 'v-form-group#name');
                Ember.run(() => this.form.model.set('name', ''));
                expect(group.message).to.equal('can\'t be blank');
                // Ember.run(() => this.form.model.set('name', 'a name'));
                // expect(group.message).to.not.be.ok;
            });
        });
    }
);
