import sinon from 'sinon';
import { expect } from 'chai';
import { describeComponent } from 'ember-mocha';
import { describe, it, beforeEach, before } from 'mocha';
import hbs from 'htmlbars-inline-precompile';
import _ from 'lodash/lodash';
import DS from 'ember-data';
import Ember from 'ember';

const defaultAttrs = 'name password accepted address.street address.city'.split(' ');

const formParams = {
    template: hbs `
    {{#v-form-group property="name" elementId="nameId"}}
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
  `
};

describeComponent(
    'v-form',
    'VFormComponent',
    {
        needs: [
            'component:v-form',
            'component:v-form-group',
            'component:v-form-submit',
            'model:person'
        ]
    },
    function() {
        describe('rendering', function() {
            it('renders with proper classname and children', function() {
                const form = this.subject(formParams);
                Ember.run(() => {
                    const store = getStore(this);
                    form.set('model', store.createRecord('person'));
                });

                expect(form._state).to.equal('preRender');
                this.render();
                expect(form._state).to.equal('inDOM');
                expect(_.all(form.childViews, cv => cv._state === 'inDOM')).to.be.ok;
                expect(Ember.$(form.element).hasClass('form-horizontal')).to.be.ok;
            });

            it('has property array filled and observers defined', function() {
                const form = this.subject(formParams);
                Ember.run(() => {
                    const store = getStore(this);
                    form.set('model', store.createRecord('person'));
                });

                this.render();
                const formAttrs = _.chain(form.properties)
                    .map(p => p.properties)
                    .flatten()
                    .value();
                expect(_.xor(formAttrs, defaultAttrs)).to.have.length(0);
                expect(_.all(defaultAttrs, a => form.hasObserverFor(`model.${a}`))).to.be.ok;
            });
        });

        describe('submission', function() {
            it('calls full model validation', function() {
                const form = this.subject(formParams);
                Ember.run(() => {
                    const store = getStore(this);
                    form.set('model', store.createRecord('person'));
                });
                const spy  = sinon.spy(form.model, 'validate');
                this.render();
                Ember.$(form.element).trigger('submit');
                expect(spy.calledWith()).to.be.ok;
            });

            describe('on fully invalid form', function() {
                it('assigns errors on each property', function() {
                    const form = this.subject(formParams);
                    Ember.run(() => {
                        const store = getStore(this);
                        form.set('model', store.createRecord('person'));
                    });

                    this.render();
                    Ember.$(form.element).trigger('submit');
                    const errors = form.model.get('errors.content').mapBy('attribute');
                    expect(_.xor(errors, defaultAttrs)).to.have.length(0);
                });

                it('has invalid property set to true', function() {
                    const form = this.subject(formParams);
                    Ember.run(() => {
                        const store = getStore(this);
                        form.set('model', store.createRecord('person'));
                    });

                    this.render();
                    Ember.$(form.element).trigger('submit');
                    expect(form.get('invalid')).to.be.ok;
                });

                it('does not send submit action', function() {
                    const form = this.subject(formParams),
                          spy  = sinon.spy(form, 'sendAction');
                    Ember.run(() => {
                        const store = getStore(this);
                        form.set('model', store.createRecord('person'));
                    });

                    this.render();
                    Ember.$(form.element).trigger('submit');
                    expect(spy.neverCalledWith('submitAction')).to.be.ok;
                });
            });

            describe('on partially invalid form', function() {
                it('clears errors on valid property', function() {
                    const form = this.subject(formParams);
                    Ember.run(() => {
                        const store = getStore(this),
                              model = store.createRecord('person');
                        model.setProperties({
                            name: 'some name',
                            address: {city: 'some city'}
                        });
                        form.set('model', model);
                    });

                    this.render();
                    Ember.$(form.element).trigger('submit');
                    Ember.$(form.element).trigger('submit');
                    const errors = form.model.get('errors.content').mapBy('attribute');
                    expect(_.contains(errors, 'name')).to.not.be.ok;
                    expect(_.contains(errors, 'address.city')).to.not.be.ok;
                });
            });
        });
    }
);

function getStore(thisArg) {
    const store = DS.Store.extend({
        adapter: DS.MochaAdapter
    });

    return store.create({
        container: thisArg.container
    });
}
