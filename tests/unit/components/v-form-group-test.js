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
                  property: 'name',
                  parentView: Ember.Object.create({
                      properties: Ember.A([])
                  })
              });
              expect(this.component._state).to.equal('preRender');
              this.render();
              this.element = Ember.$(this.component.element);
          });

          it('renders with proper classname', function() {
              expect(this.component._state).to.equal('inDOM');
              expect(this.element.hasClass('form-group')).to.be.ok;
          });
      });

      describe('property assignment', function() {
          beforeEach(function() {

          });

          it('pushes its id and property name to parentView', function() {
              this.component = this.subject({
                  property: 'name',
                  parentView: Ember.Object.create({
                      properties: Ember.A([]),
                      model: Ember.Object.create({name: ''})
                  })
              });
              this.render();

              expect(this.component.get('parentView.properties')[0].pid)
                .to.equal(this.component.get('pid'));
              expect(this.component.get('parentView.properties')[0].properties)
                .to.include(this.component.get('property'));
          });

          it('creates an observer on its property in parentView', function() {
              this.component = this.subject({
                  property: 'password',
                  parentView: Ember.Object.create({
                      properties: Ember.A([]),
                      model: Ember.Object.create({password: ''})
                  })
              });
              this.render();

              expect(this.component.get('parentView').hasObserverFor('model.password'))
                .to.be.ok;
          });

          it('assigns observers on multiple properties', function() {
              this.component = this.subject({
                  property: '[password, passwordConfirmation]',
                  parentView: Ember.Object.create({
                      properties: Ember.A([]),
                      model: Ember.Object.create({
                          password: '',
                          passwordConfirmation: ''
                      })
                  })
              });
              this.render();
              const parentView = this.component.get('parentView'),
                    checks = [
                        'password',
                        'passwordConfirmation'
                    ].map(p => parentView.hasObserverFor(`model.${p}`));
              expect(checks.every(c => c)).to.be.ok;
          });

          it('assigns observers on nested multiple properties', function() {
              this.component = this.subject({
                  property: 'address.[country, city]',
                  parentView: Ember.Object.create({
                      properties: Ember.A([]),
                      model: Ember.Object.create({address: {}})
                  })
              });
              this.render();
              const parentView = this.component.get('parentView'),
                    checks = [
                        'address.country',
                        'address.city'
                    ].map(p => parentView.hasObserverFor(`model.${p}`));
              expect(checks.every(c => c)).to.be.ok;
          });
      });

      describe('validation', function() {
          beforeEach(function() {
              this.component = this.subject({
                  parentView: Ember.Object.create({
                      properties: Ember.A([]),
                      model: Ember.Object.create({
                          name: ''
                      })
                  }),
                  property: 'name'
              });
              this.render();
          });

          describe('if field is valid', function() {
              beforeEach(function() {
                  this.component.parentView.validateProperty = _ => {};
                  Ember.run(() => this.component.revalidate());
              });

              it('has no message', function() {
                  expect(this.component.get('message')).to.not.be.ok;
              });

              it('has hasError property set to false', function() {
                  expect(this.component.get('hasError')).to.not.be.ok;

              });

          });

          describe('if field is invalid', function() {
              beforeEach(function() {
                  this.component.parentView.validateProperty = (a) => a;
                  Ember.run(() => this.component.revalidate());
              });

              it('has a message', function() {
                  expect(this.component.get('message')).to.equal('name');
              });

              it('has hasError property set to true', function() {
                  expect(this.component.get('hasError')).to.be.ok;
              });

          });

      });
  }
);
