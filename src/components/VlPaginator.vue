<script>
    import {utils} from '../utils';

    export default {
        name: 'VlPaginator',

        props: {
            total: {
                type: Number,
                required: true
            },
            perPage: {
                type: Number,
                default: 10,
                validator(value) {
                    return value > 0;
                }
            },
            value: {
                type: Number,
                default: 1
            },
            callback: {
                type: Function
            },
            onEachSide: {
                type: Number,
                default: 3
            },
            previousText: {
                type: String,
                default: '&laquo;'
            },
            nextText: {
                type: String,
                default: '&raquo;'
            },
            seperatorText: {
                type: String,
                default: '...'
            }
        },

        computed: {
            lastPage: function () {
                return Math.max(Math.ceil(this.total / this.perPage), 1);
            },

            currentPage: function () {
                return this.isValidPageNumber(this.value) ? Number.parseInt(this.value) : 1;
            },

            hasMorePages: function () {
                return this.currentPage < this.lastPage;
            },

            hasPages: function () {
                return this.total > 0 && (this.currentPage != 1 || this.hasMorePages);
            },

            onFirstPage: function () {
                return this.currentPage <= 1;
            },

            previousPage: function () {
                if (this.currentPage > 1) {
                    return this.currentPage - 1;
                }

                return false;
            },

            nextPage: function () {
                if (this.lastPage > this.currentPage) {
                    return this.currentPage + 1;
                }

                return false;
            },

            elements: function () {
                let elementWindow = this.makeElementWindow();

                return utils.compact([
                    elementWindow.first,
                    Array.isArray(elementWindow.slider) ? this.seperatorText : null,
                    elementWindow.slider,
                    Array.isArray(elementWindow.last) ? this.seperatorText : null,
                    elementWindow.last,
                ]);
            }
        },

        methods: {
            isValidPageNumber(page) {
                return page >= 1 && Number.isInteger(page);
            },

            setCurrentPage(page) {
                this.$emit('input', page);

                if (this.callback) {
                    this.callback();
                }
            },

            makeElementWindow() {
                if (this.lastPage < (this.onEachSide * 2) + 6) {
                    return this.getSmallSlider();
                }

                return this.getElementSlider(this.onEachSide);
            },

            getSmallSlider() {
                return {
                    'first': this.getElementRange(1, this.lastPage),
                    'slider': null,
                    'last': null,
                };
            },

            getElementSlider(onEachSide) {
                let onBothSide = onEachSide * 2;

                if (! this.hasPages) {
                    return {'first': null, 'slider': null, 'last': null};
                }

                // If the current page is very close to the beginning of the page range, we will
                // just render the beginning of the page range, followed by the last 2 of the
                // links in this list, since we will not have room to create a full slider.
                if (this.currentPage <= onBothSide) {
                    return this.getSliderTooCloseToBeginning(onBothSide);
                }

                // If the current page is close to the ending of the page range we will just get
                // this first couple pages, followed by a larger window of these ending pages
                // since we're too close to the end of the list to create a full on slider.
                else if (this.currentPage > (this.lastPage - onBothSide)) {
                    return this.getSliderTooCloseToEnding(onBothSide);
                }

                // If we have enough room on both sides of the current page to build a slider we
                // will surround it with both the beginning and ending caps, with this window
                // of pages in the middle providing a Google style sliding paginator setup.
                return this.getFullSlider(onEachSide);
            },

            getSliderTooCloseToBeginning(onBothSide) {
                return {
                    'first': this.getElementRange(1, onBothSide + 2),
                    'slider': null,
                    'last': this.getFinish(),
                }
            },

            getSliderTooCloseToEnding(onBothSide) {
                let last = this.getElementRange(
                    this.lastPage - (onBothSide + 2),
                    this.lastPage
                );

                return {
                    'first': this.getStart(),
                    'slider': null,
                    'last': last,
                };
            },

            getFullSlider(onEachSide) {
                return {
                    'first': this.getStart(),
                    'slider': this.getAdjacentElementRange(onEachSide),
                    'last': this.getFinish(),
                };
            },

            getAdjacentElementRange(onEachSide) {
                return this.getElementRange(
                    this.currentPage - onEachSide,
                    this.currentPage + onEachSide
                );
            },

            getStart() {
                return this.getElementRange(1, 2);
            },

            getFinish() {
                return this.getElementRange(this.lastPage - 1, this.lastPage);
            },

            getElementRange(start, end) {
                return utils.range(start, end + 1);
            }
        }
    }
</script>

<template>
    <ul class="pagination" v-if="hasPages">
        <!-- Previous Page Link -->
        <li class="page-item disabled" v-if="onFirstPage" key="prev-page"><span class="page-link" v-html="previousText"></span></li>
        <li class="page-item" v-else key="prev-page"><a class="page-link" rel="prev" @click.prevent="setCurrentPage(previousPage)" v-html="previousText"></a></li>

        <!-- Pagination Elements -->
        <template v-for="element in elements">
            <!-- "Three Dots" Separator -->
            <li class="page-item disabled" v-if="typeof element == 'string'"><span class="page-link">{{ element }}</span></li>

            <!-- Array Of Links -->
            <template v-if="Array.isArray(element)" v-for="page in element">
                <li class="page-item active" v-if="page == currentPage"><span class="page-link">{{ page }}</span></li>
                <li class="page-item" v-else><a class="page-link" @click.prevent="setCurrentPage(page)">{{ page }}</a></li>
            </template>
        </template>

        <!-- Next Page Link -->
        <li class="page-item" v-if="hasMorePages" key="next-page"><a class="page-link" rel="next" @click.prevent="setCurrentPage(nextPage)" v-html="nextText"></a></li>
        <li class="page-item disabled" v-else key="next-page"><span class="page-link" v-html="nextText"></span></li>
    </ul>
</template>
