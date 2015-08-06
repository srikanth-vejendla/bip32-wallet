/* global beforeEach, describe, it */

var assert = require('assert')

var selectInputs = require('../src/selection')
var fixtures = require('./fixtures/selection.json')

describe('selectInputs', function () {
  fixtures.valid.forEach(function (f) {
    var outputs, unspents

    beforeEach(function () {
      outputs = f.outputs.map(function (value) { return { value: value } })
      unspents = f.unspents.map(function (value) { return { value: value } })
    })

    it(f.description, function () {
      var result = selectInputs(unspents, outputs, f.feePerKb)

      var expected = f.expected.inputs.map(function (i) {
        return unspents[i]
      })

      // ensure remainder is correctly calculated
      assert.equal(result.remainder, f.expected.remainder, 'Invalid remainder: ' + result.remainder + ' !== ' + f.expected.remainder)

      // ensure fee is correctly calculated
      assert.equal(result.fee, f.expected.fee, 'Invalid fee: ' + result.fee + ' !== ' + f.expected.fee)

      // ensure all expected inputs are found
      expected.forEach(function (input) {
        assert(result.inputs.indexOf(input) > -1)
      })

      // ensure no other inputs exist
      assert.equal(result.inputs.length, f.expected.inputs.length)
    })
  })

  fixtures.invalid.forEach(function (f) {
    var outputs, unspents

    beforeEach(function () {
      outputs = f.outputs.map(function (value) { return { value: value } })
      unspents = f.unspents.map(function (value) { return { value: value } })
    })

    it('throws on ' + f.exception, function () {
      assert.throws(function () {
        selectInputs(unspents, outputs, f.feePerKb)
      }, new RegExp(f.exception))
    })
  })
})
