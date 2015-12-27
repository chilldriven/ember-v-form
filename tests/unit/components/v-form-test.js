import { expect } from 'chai';
import { describeComponent } from 'ember-mocha';
import { describe, it, beforeEach } from 'mocha';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import DS from 'ember-data';

const Person = Ember.Object.create({
    name: '',
    password: '',
    accepted: false,
    address: {},
    errors: Ember.Object.create({content: Ember.A([])}),
    validate(arg) {
        if (arg) {
            return _setErrors(arg.only, this);
        } else {
            return 'name password accepted address.street address.city'
                .split(' ')
                .map(attr => _setErrors(attr, this))
                .every(bool => bool);
        }
    }
});

function _setErrors(attr, thisArg) {
    thisArg.get('errors.content')
           .pushObject({attribute: attr, message: [`blank ${attr}`]});
    return !!thisArg.get(attr);
}

describeComponent(
  'v-form',
  'VFormComponent',
  {
      needs: ['component:v-form-group']
  },
  function() {
      beforeEach(function() {
          this.component = this.subject({
              model: Person,
              template: hbs`
                {{#v-form-group property="name" elementId="nameId"}}
                    <input type="text"/>
                {{/v-form-group}}
                {{#v-form-group property="password"}}
                    <input type="password"/>
                {{/v-form-group}}
                {{#v-form-group property="accepted"}}
                    <input type="checkbox"/>
                {{/v-form-group}}
                {{#v-form-group property="address.[city, street]"}}
                    <input type="text"/>
                    <input type="text"/>
                {{/v-form-group}}
              `
          });
      });

      describe('rendering', function() {
          beforeEach(function() {
              expect(this.component._state).to.equal('preRender');
              this.render();
              this.element = Ember.$(this.component.element);
          });

          it('renders with proper classname and children', function() {
              expect(this.component._state).to.equal('inDOM');
              this.component.childViews.forEach(cv => {
                  expect(cv._state).to.equal('inDOM');
              });
              expect(this.element.hasClass('form-horizontal')).to.be.ok;
          });
      });

      describe('submission', function() {
          beforeEach(function() {
              expect(this.component._state).to.equal('preRender');
              this.render();
              this.element = Ember.$(this.component.element);
              this.element.trigger('submit');
          });
          describe('on empty form', function() {
              it('assigns errors on each property', function() {
                  expect(this.component.model.get('errors.content'))
                    .not.to.be.empty;
                  expect(this.component.model.get('errors.content'))
                    .to.have.length(5);
              });
          });
      });
  }
);
