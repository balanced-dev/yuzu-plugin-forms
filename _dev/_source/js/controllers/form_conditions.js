const applyDestFieldState = (destField, apply) => {
    var formWrapper = destField.closest('div[data-field]');
    formWrapper.style.display = apply ? 'block' : 'none';
    destField.style.display = apply ? 'block' : 'none';
}

const processSingleRule = (rule, value) => {

    let result = false;

    if(rule.operator === 'Is' && value === rule.value) result = true;
    if(rule.operator === 'IsNot' && value !== rule.value) result = true;
    if(rule.operator === 'GreaterThen' && !isNaN(value) && Number(value) > Number(rule.value)) result = true;
    if(rule.operator === 'LessThen' && value !== '' && !isNaN(value) && Number(value) < Number(rule.value)) result = true;
    if(rule.operator === 'Contains' && value.includes(rule.value)) result = true;
    if(rule.operator === 'StartsWith' && value.startsWith(rule.value)) result = true;
    if(rule.operator === 'EndsWith' && value.endsWith(rule.value)) result = true;

    return result;
}

const getField = function(form, field) {

    var output = form.querySelector(`[name="${field}"]`);
    if(output.type === 'radio') {
        var selectedRadio = form.querySelector(`[name="${field}"]:checked`);
        return selectedRadio ? selectedRadio : '';
    }
    return output;
}

const getFields = function(form, field) {

    return form.querySelectorAll(`[name="${field}"]`);
}

const getFieldValue = function(field) {

    if(field.type === 'checkbox') {
        return String(field.checked);
    }
    else {
        return field.value;
    }
}

const getDefaultState = function(condition)
{
    return condition.actionType === 'Hide';
}

const applyRules = (form, condition, destField) => {

    let results = [];

    condition.rules.forEach((rule) => {
        let triggerField = getField(form, rule.field);
        let value = getFieldValue(triggerField);
        let result = processSingleRule(rule, value);
        results.push(result);
    }) 

    if(condition.logicType === 'Any' && results.some(r => r)) {
        applyDestFieldState(destField, !getDefaultState(condition));
    }
    else if(condition.logicType === 'All' && results.every(r => r)) {
        applyDestFieldState(destField, !getDefaultState(condition));
    }
    else {
        applyDestFieldState(destField, getDefaultState(condition));
    }
}

const addRuleEvent = (form, condition, destField, rule) => {

    const triggerFields = getFields(form, rule.field);
    triggerFields.forEach((triggerField) => {
        triggerField.addEventListener('change', (field) => {
            applyRules(form, condition, destField);
        })
    })
}
 
const getConditions = (form, destField) => {

    let condition = JSON.parse(destField.dataset.conditions);
    if(condition && condition.rules) {
        applyRules(form, condition, destField);

        condition.rules.forEach((rule) => {
            addRuleEvent(form, condition, destField, rule);
        })
    }
}

const init = function(form) {
    form.querySelectorAll('[data-conditions]').forEach((element) => {
        getConditions(form, element);
    });
}

export default {
    init: init
};