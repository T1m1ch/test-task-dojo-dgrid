require(["utils/ExtendedGrid", "data/gridData", "dojo/domReady!"], function(ExtendedGrid, gridData) {
    const columns = {
        name: {
            label: "Name"
        },
        age: {
            label: "Age"
        },
        sex: { 
            label: "Sex"
        },
        address: { 
            label: "Address"
        }
    }

    const grid = new ExtendedGrid({columns, resizebleColumns: true}, "grid");
    grid.renderArray(gridData.data);
});