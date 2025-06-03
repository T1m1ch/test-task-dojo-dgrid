require(["dojo/_base/declare", "dgrid/OnDemandGrid", "dojo/dom", "dojo/dom-construct", "data/gridData", "dojo/on", "dojo/domReady!"], function(declare, Grid, dom, domConstruct, gridData, on) {

    function getRenderHeaderCellFunc(label) {
        return function renderHeaderCell(node) {
            domConstruct.place(`<div>${label}</div>`, node);
        }
    }


    function renderCell(object, value, node) {
        const inserted = domConstruct.place(`<div class="inner-cell">${value}</div>`, node);
        setTimeout(() => {
            if (parseFloat(window.getComputedStyle(inserted).height) > 16.0) {
                inserted.classList.add("drop-down-cell");
                inserted.classList.add("closed");
                const dropDownButton = domConstruct.place(`<button class="drop-down-cell-button"><svg width="16" height="16" viewBox="0 0 16 16"><polyline points="5 9 8 7 11 9" stroke="black" stroke-width="2" fill="none" /></svg></button>`, inserted);
                on(dropDownButton, "click", () => inserted.classList.toggle("closed"));
            }
        }, 0);
    }

    const columns = {
        name: {
            renderCell,
            renderHeaderCell: getRenderHeaderCellFunc("Name")
        },
        age: {
            renderCell,
            renderHeaderCell: getRenderHeaderCellFunc("Age")
        },
        
        sex: { 
            renderCell,
            renderHeaderCell: getRenderHeaderCellFunc("Sex")
        },
        address: { 
            renderCell,
            renderHeaderCell: getRenderHeaderCellFunc("Address")
        }
    }

    const grid = new Grid({
        columns
    }, "grid");

    grid.renderArray(gridData.data);
    gridDomNode = grid.domNode;

    setTimeout(() => {
    
        const headers = gridDomNode.querySelectorAll(".dgrid-cell");
        const firstRow = gridDomNode.querySelectorAll("tr")[1].querySelectorAll("td");
        for (let i = 0; i != 4; i++) {
            if (firstRow[i].querySelector("button")) {
                const headerNode = headers[i];
                const dropDownButton = domConstruct.place(`<button class="drop-down-cell-button hidden"><svg width="16" height="16" viewBox="0 0 16 16"><polyline points="5 7 8 5 11 7" stroke="black" stroke-width="2" fill="none" /><polyline points="5 11 8 9 11 11" stroke="black" stroke-width="2" fill="none" /></svg></button>`, headerNode);
                on(dropDownButton, "click", () => {
                    const wasOpened = headerNode.classList.toggle("opened");
                    const gridRows = gridDomNode.querySelectorAll(".dgrid-row");
                    gridRows.forEach(row => {
                        const columnCell = row.querySelectorAll(".inner-cell")[i];
                        if (wasOpened) {
                            columnCell.classList.remove("closed");
                        } else {
                            columnCell.classList.add("closed");
                        }
                    })
                });
            }
        }
    }, 0);
});