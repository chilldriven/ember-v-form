import { expect } from 'chai';
import { describeComponent } from 'ember-mocha';
import { describe, it, beforeEach } from 'mocha';
import Ember from 'ember';

describeComponent(
  'v-form',
  'VFormComponent',
  {
    needs: ['model:person'],
  },
  function() {
    describe('rendering', function() {
      beforeEach(function() {
        this.component = this.subject({
          childViews: [Ember.Object.create({property: 'name'})],
        });
        expect(this.component._state).to.equal('preRender');
        this.render();
      });

      it('renders with proper classname', function() {
        expect(this.component._state).to.equal('inDOM');
        expect(Ember.$(this.component.element).hasClass('form-horizontal')).to.be.ok;
      });
    });
  }
);
