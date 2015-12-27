[![Build Status](https://travis-ci.org/cataline/ember-v-form.svg?branch=master)](https://travis-ci.org/cataline/ember-v-form)
# ember-v-form

A simple and highly customizable form validation addon, built on top of [ember-model-validator](https://github.com/esbanarango/ember-model-validator).

## Dependencies
* [ember-model-validator](https://github.com/esbanarango/ember-model-validator)
* [ember-lodash](https://github.com/mike-north/ember-lodash)

## Usage
This addon consists of two components: `v-form` and `v-form-group`. Used as follows (model has to have validations, go [here](https://github.com/esbanarango/ember-model-validator) for validation examples):

```handlebars
{{#v-form model=model}}
  {{#v-form-group property="name"}}
    <!-- any kind of input here -->
  {{/v-form-group}}
{{/v-form}}
```

### Compound properties
Sometimes you want to have two fields validated by same rule. This:
```handlebars
{{#v-form model=model}}
  {{#v-form-group property="[firstname, lastname]"}}
    <!-- input1 -->
    <!-- input2 -->
  {{/v-form-group}}
{{/v-form}}
```

Or even this:
```handlebars
{{#v-form model=model}}
  {{#v-form-group property="address.[city, street]"}}
    <!-- input1 -->
    <!-- input2 -->
  {{/v-form-group}}
{{/v-form}}
```
will work for you.

### Non-standard inputs
Since this addon doesn't have any predefined inputs and relies on model-level validation, it can and will work with anything that behaves like an input (changes model properties, that is).

### Bootstrap
By default, `v-form` and `v-form-group` are assigned bootstrap classes `form-horizontal`, and `form-group` respectively. Invalid fields receive bootstrap `has-error` class. If you want to change this behaviour, just pass your own classes into the component like this:

```handlebars
{{#v-form model=model class="my-class"}}
  {{#v-form-group property="foo.[bar, baz]" class="my-other-class" errorClass="my-error-class"}}
    <!-- label1 -->
    <!-- input1 -->
    <!-- label2 -->
    <!-- input2 -->
  {{/v-form-group}}
{{/v-form}}
```
## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
