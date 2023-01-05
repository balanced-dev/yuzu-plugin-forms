import template from './parFormButton.html'

export default (Vue, blockHelper) => {

    Vue.component('form-button', {
        mixins: [blockHelper.compile(template)],
        props: {
            vm: Object,
            _modifiers: Array,
        }
    });

}


