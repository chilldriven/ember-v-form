import { expect } from 'chai';
import { describeComponent } from 'ember-mocha';
import { describe, it, beforeEach } from 'mocha';
import Ember from 'ember';

describeComponent(
  'v-form-group',
  'VFormGroupComponent',
  {
    // Specify the other units that are required for this test
    needs: ['component:v-form'],
  },
  function() {
    describe('rendering', function() {
      beforeEach(function() {
        this.component = this.subject({
          parentView: Ember.Object.create({properties: []}),
        });
        expect(this.component._state).to.equal('preRender');
        this.render();
      });

      it('renders with proper classname', function() {
        expect(this.component._state).to.equal('inDOM');
        expect(Ember.$(this.component.element).hasClass('form-group')).to.be.ok;
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
              name: '',
            }),
          }),
          property: 'name',
        });
        expect(this.component._state).to.equal('preRender');
      });

      it('has no message if field is valid', function() {
        this.component.parentView.validateProperty = function(propertyKey) {};

        this.render();
        Ember.run(() => this.component.revalidate());
        expect(this.component.get('message')).to.not.be.ok;
      });

      it('has a message if field is invalid', function() {
        this.component.parentView.validateProperty = function(propertyKey) {
          return propertyKey;
        };

        this.render();
        Ember.run(() => this.component.revalidate());
        expect(this.component.get('message')).to.equal('name');
      });

    });
  }
);
