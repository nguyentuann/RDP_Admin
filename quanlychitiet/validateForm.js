
function Validator(formSelector) {

  function getParent(element, selector) {
    while (element.parentElement) {
      var parent = element.parentElement;
      while (parent) {
        if (parent.matches(selector)) {
          return parent;
        }
        element = parent;
      }
    }
  }

  var formRules = {}

  /**
   * quy uoc
   * co loi return error message
   * khong loi return undefined
   */
  var validatorRules = {
    required: function (value) {
      return value ? undefined : 'Vui lòng nhập trường này';
    },
    email: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : 'Vui lòng nhập email';
    },
    min: function (min) {
      return function (value) {
        return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} ký tự`;
      }
    },
  };

  var ruleName = 'required';

  //lấy ra form element
  var formElement = document.querySelector(formSelector);
  if (formElement) {

    var inputs = formElement.querySelectorAll('[name][rules]');
    for (var input of inputs) {

      var rules = input.getAttribute('rules').split('|');
      for (var rule of rules) {
        var ruleInfo;
        var isRuleHasValue = rule.includes(':');
        if (isRuleHasValue) {
          ruleInfo = rule.split(':');
          rule = ruleInfo[0];
        }

        var ruleFunc = validatorRules[rule];

        if (isRuleHasValue) {
          ruleFunc = ruleFunc(ruleInfo[1]);
        }

        if (Array.isArray(formRules[input.name])) {
          formRules[input.name].push(ruleFunc);
        } else {
          formRules[input.name] = [ruleFunc];
        }
        // lang nghe su kien de validate (blur, change)
        input.onblur = handleValidate;
        input.oninput = handleClearError;
      }

      // ham thuc hien validate
      function handleValidate(event) {

        var rules = formRules[event.target.name];
        var errorMessage;

        for (var rule of rules) {
          errorMessage = rule(event.target.value);
          console.log("Checking rule:", rule, "with value:", event.target.value, "=> Error:", errorMessage);
          if (errorMessage) break;
        }
        

        // hien thi loi ra UI
        if (errorMessage) {
          var formGroup = getParent(event.target, '.form__group');
          if (formGroup) {
            formGroup.classList.add('invalid')
            var formMessage = formGroup.querySelector('.form-message');
            if (formMessage) {
              formMessage.innerText = errorMessage;
            }
          }
          return false;
        } else {
          return true;
        }
      }

      function handleClearError(event) {
        var formGroup = getParent(event.target, '.form__group');
        if (formGroup.classList.contains('invalid')) {
          formGroup.classList.remove('invalid');
          var formMessage = formGroup.querySelector('.form-message');
          if (formMessage) {
            formMessage.innerText = '';
          }
        }
      }
    }
    this.validateForm = function () {
      var isValid = true;
      for (var input of inputs) {
        if (!handleValidate({ target: input })) {
          isValid = false;
        }
      }
      console.log(isValid);
      return isValid;
    };
  }
}
