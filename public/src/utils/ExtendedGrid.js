define(["dojo/dom-construct", "dojo/on", "dgrid/OnDemandGrid"], (domConstruct, on, OnDemandGrid) => {
    return class ExtendedGrid extends OnDemandGrid {
        #_extendedColumns = null;
        constructor(options, domNode) {
            const extendedColumns = new Set();

            const getRendeHeaderCellFunction = (label) => {
                return (node) => {
                    node.style.minHeight = "42px";
                    node.textContent = label;
                }
            }

            const renderCell = (object, value, node) => {
                const inserted = domConstruct.place(`<div class="inner-cell">${value}</div>`, node);
                requestAnimationFrame(() => {
                    if (parseFloat(window.getComputedStyle(inserted).height) > 32) {
                        extendedColumns.add(node.classList[2]); 
                        inserted.classList.add(`_${node.classList[2]}`);
                        inserted.classList.add("drop-down-cell");
                        inserted.classList.add("closed");
                        const dropDownButton = domConstruct.place(`<button class="drop-down-cell-button"><svg width="16" height="16" viewBox="0 0 16 16"><polyline points="5 9 8 7 11 9" stroke="black" stroke-width="2" fill="none" /></svg></button>`, inserted);
                        on(dropDownButton, "click", () => inserted.classList.toggle("closed"));
                    }
                });
            }
      
            options.columns = Object.entries(options.columns).reduce((acc, [key, value]) => {
                acc[key] = { ...value, renderCell, renderHeaderCell: getRendeHeaderCellFunction(value.label)};
                return acc;
            }, {});

            super(options, domNode);
            this.domNode.classList.add("extended-grid");
            if (options.resizebleColumns !== false) {
                this.domNode.classList.add("resizeble");
            }
            this.#_extendedColumns = extendedColumns;
        }

        renderArray(data) {
            super.renderArray(data);
            setTimeout(() => {
                const headers = this.domNode.querySelectorAll(`[role="columnheader"]`);
                headers.forEach(header => {
                    if (this.#_extendedColumns.has(header.classList[2])) {
                        header.classList.add("closed");
                        const dropDownButton = domConstruct.place(`<button class="drop-down-cell-button"><svg width="16" height="16" viewBox="0 0 16 16"><polyline points="5 7 8 5 11 7" stroke="black" stroke-width="2" fill="none" /><polyline points="5 11 8 9 11 11" stroke="black" stroke-width="2" fill="none" /></svg></button>`, header);
                        on(dropDownButton, "click", () => {
                            const dropDownCells = this.domNode.querySelectorAll(`.drop-down-cell._${header.classList[2]}`);
                            const wasClosed = header.classList.toggle("closed");
                            dropDownCells.forEach(cell => {
                                if (wasClosed) {
                                    cell.classList.add("closed");  
                                } else {
                                    cell.classList.remove("closed");
                                }   
                            });
                        });
                    }
                });
            }, 0);
        }
    }
});