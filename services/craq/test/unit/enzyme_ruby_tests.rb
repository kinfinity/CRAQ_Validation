require 'test/unit'

class CraqValidatorTest < Test::Unit::TestCase
  description 'it is invalid with no answers'
  def test1
    @questions = [{ text: 'q1', options: [{ text: 'an option' }, { text: 'another option' }] }]
    @answers = {}
    assert_errors q0: 'was not answered'
  end

  description 'it is invalid with nil answers'
  def test2
    @questions = [{ text: 'q1', options: [{ text: 'an option' }, { text: 'another option' }] }]
    @answers = nil
    assert_errors q0: 'was not answered'
  end

  description 'errors are added for all questions'
  def test3
    @questions = [
      { text: 'q1', options: [{ text: 'an option' }, { text: 'another option' }] },
      { text: 'q2', options: [{ text: 'an option' }, { text: 'another option' }] }
    ]
    @answers = nil
    assert_errors q0: 'was not answered', q1: 'was not answered'
  end

  description 'it is valid when an answer is given'
  def test4
    @questions = [{ text: 'q1', options: [{ text: 'yes' }, { text: 'no' }] }]
    @answers = { q0: 0 }
    assert_valid
  end

  description 'it is valid when there are multiple options and the last option is chosen'
  def test5
    @questions = [{ text: 'q1', options: [{ text: 'yes' }, { text: 'no' }, { text: 'maybe' }] }]
    @answers = { q0: 2 }
    assert_valid
  end

  description 'it is invalid when an answer is not one of the valid answers'
  def test6
    @questions = [{ text: 'q1', options: [{ text: 'an option' }, { text: 'another option' }] }]
    @answers = { q0: 2 }
    assert_errors q0: 'has an answer that is not on the list of valid answers'
  end

  description 'it is invalid when not all the questions are answered'
  def test7
    @questions = [
      { text: 'q1', options: [{ text: 'an option' }, { text: 'another option' }] },
      { text: 'q2', options: [{ text: 'an option' }, { text: 'another option' }] }
    ]
    @answers = { q0: 0 }
    assert_errors q1: 'was not answered'
  end

  description 'it is valid when all the questions are answered'
  def test8
    @questions = [
      { text: 'q1', options: [{ text: 'an option' }, { text: 'another option' }] },
      { text: 'q2', options: [{ text: 'an option' }, { text: 'another option' }] }
    ]
    @answers = { q0: 0, q1: 0 }
    assert_valid
  end

  description 'it is valid when questions after complete_if_selected are not answered'
  def test9
    @questions = [
      { text: 'q1', options: [{ text: 'yes' }, { text: 'no', complete_if_selected: true }] },
      { text: 'q2', options: [{ text: 'an option' }, { text: 'another option' }] }
    ]
    @answers = { q0: 1 }
    assert_valid
  end

  description 'it is invalid if questions after complete_if are answered'
  def test10
    @questions = [
      { text: 'q1', options: [{ text: 'yes' }, { text: 'no', complete_if_selected: true }] },
      { text: 'q2', options: valid_options }
    ]
    @answers = { q0: 1, q1: 0 }

    assert_errors(
      q1: 'was answered even though a previous response indicated that the questions were complete'
    )
  end

  description 'it is valid if complete_if is not a terminal answer and further questions are answered'
  def test11
    @questions = [
      { text: 'q1', options: [{ text: 'yes' }, { text: 'no', complete_if_selected: true }] },
      { text: 'q2', options: [{ text: 'an option' }, { text: 'another option' }] }
    ]

    @answers = { q0: 0, q1: 1 }
    assert_valid
  end

  description 'it is invalid if complete_if is not a terminal answer and further questions are not answered'
  def test12
    @questions = [
      { text: 'q1', options: [{ text: 'yes' }, { text: 'no', complete_if_selected: true }] },
      { text: 'q2', options: [{ text: 'an option' }, { text: 'another option' }] }
    ]
    @answers = { q0: 0 }
    assert_errors q1: 'was not answered'
  end

  private

  def answers_valid?
    @validator = CraqValidator.new @questions, @answers
    @validator.valid?
  end

  def assert_valid(message: nil)
    answers_valid?
    assert answers_valid?, (message || "expected to be valid but was not: #{@validator.errors}")
  end

  def refute_valid(message: 'expected to be invalid but was valid')
    refute answers_valid?, message
  end

  def assert_errors(errors)
    refute_valid
    assert_equal errors, @validator.errors
  end

  def valid_options
    [{ text: 'an option' }, { text: 'another option' }]
  end
end