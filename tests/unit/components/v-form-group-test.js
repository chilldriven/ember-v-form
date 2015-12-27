import { expect } from 'chai';
import { describeComponent } from 'ember-mocha';
import { describe, it, beforeEach } from 'mocha';
import Ember from 'ember';

describeComponent(
  'v-form-group',
  'VFormGroupComponent',
  {
      // Specify the other units that are required for this test
      needs: ['component:v-form']
  },
  function() {
      describe('rendering', function() {
          beforeEach(function() {
              this.component = this.subject({
                  parentView: Ember.Object.create({properties: []})
              });
              expect(this.component._state).to.equal('preRender');
              this.render();
              this.element = Ember.$(this.component.element);
          });

          it('renders with proper classname', function() {
              expect(this.component._state).to.equal('inDOM');
              expect(this.element.hasClass('form-group')).to.be.ok;
          });

          it('pushes its id and property name to parentView', function() {
              expect(this.component.get('parentView.properties')[0].id)
                .to.equal(this.component.get('elementId'));
              expect(this.component.get('parentView.properties')[0].properties)
                .to.include(this.component.get('property'));
          });
      });

      describe('validation', function() {
          beforeEach(function() {
              this.component = this.subject({
                  parentView: Ember.Object.create({
                      properties: [],
                      model: Ember.Object.create({
                          name: ''
                      })
                  }),
                  property: 'name'
              });
              expect(this.component._state).to.equal('preRender');
          });

          describe('if a field is valid', function() {
              beforeEach(function() {
                  this.component.parentView.validateProperty = _ => {};
                  this.render();
                  Ember.run(() => this.component.revalidate());
              });

              it('has no message', function() {
                  expect(this.component.get('message')).to.not.be.ok;
              });

              it('doesn\'t have "has-error" class', function() {
                  const element = Ember.$(this.component.element);
                  expect(element.hasClass('has-error')).not.to.be.ok;
              });

          });

          describe('if a field is invalid', function() {
              beforeEach(function() {
                  this.component.parentView.validateProperty = (a) => a;
                  this.render();
                  Ember.run(() => this.component.revalidate());
              });

              it('has a message', function() {
                  expect(this.component.get('message')).to.equal('name');
              });

              it('has a "has-error" class', function() {
                  const element = Ember.$(this.component.element);
                  expect(element.hasClass('has-error')).to.be.ok;
              });

          });

      });
  }
);
