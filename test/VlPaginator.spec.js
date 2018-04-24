import { shallow } from 'vue-test-utils';
import VlPaginator from '../src/components/VlPaginator.vue';

describe('VlPaginator.vue', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(VlPaginator, {
            propsData: {
                total: 11
            }
        });
    });

    it('defaults to a perPage of 10', () => {
        expect(wrapper.vm.perPage).toBe(10);
    });

    it('defaults to a currentPage of 1', () => {
        expect(wrapper.vm.value).toBe(1);
    });

    it('computes lastPage', () => {
        expect(wrapper.vm.lastPage).toBe(2);
        wrapper.setProps({
            perPage: 25
        });
        expect(wrapper.vm.lastPage).toBe(1);
    });

    it('computes currentPage', () => {
        wrapper.setProps({
            value: 2
        });
        expect(wrapper.vm.currentPage).toBe(2);
        wrapper.setProps({
            value: 0
        });
        expect(wrapper.vm.currentPage).toBe(1);
        wrapper.setProps({
            value: '1'
        });
        expect(wrapper.vm.currentPage).toBe(1);
    });

    it('computes hasMorePages', () => {
        expect(wrapper.vm.hasMorePages).toBe(true);
        wrapper.setProps({
            value: 2
        });
        expect(wrapper.vm.hasMorePages).toBe(false);
    });

    it('computes onFirstPage', () => {
        expect(wrapper.vm.onFirstPage).toBe(true);
        wrapper.setProps({
            value: 2
        });
        expect(wrapper.vm.onFirstPage).toBe(false);
    });

    it('computes previousPage', () => {
        expect(wrapper.vm.previousPage).toBe(false);
        wrapper.setProps({
            value: 2
        });
        expect(wrapper.vm.previousPage).toBe(1);
    });

    it('computes nextPage', () => {
        expect(wrapper.vm.nextPage).toBe(2);
        wrapper.setProps({
            value: 2
        });
        expect(wrapper.vm.nextPage).toBe(false);
    });

    it('computes elements', () => {
        expect(wrapper.vm.elements).toEqual([[1, 2]]);
        wrapper.setProps({
            total: 1000
        });
        expect(wrapper.vm.elements).toEqual([
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            '...',
            [99, 100],
        ]);
        wrapper.setProps({
            value: 50
        });
        expect(wrapper.vm.elements).toEqual([
            [1, 2],
            '...',
            [47, 48, 49, 50, 51, 52, 53],
            '...',
            [99, 100],
        ]);
        wrapper.setProps({
            value: 100
        });
        expect(wrapper.vm.elements).toEqual([
            [1, 2],
            '...',
            [90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100],
        ]);
    });
});
