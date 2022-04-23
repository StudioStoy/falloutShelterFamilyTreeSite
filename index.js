let URL = "https://fallout-shelter-family-tree.herokuapp.com/dweller"

fetch(URL, {
    method:"GET"
})
    .then(res => res.json())
    .then(data => {
        handleDwellerData(data)
    })
    .catch(error => console.log(error));

function handleDwellerData(dwellerData) {
    let dwellerNodeList = [];

    for (let dweller of dwellerData) {
        let dwellerName = dweller.firstName + " " + dweller.lastName;
        let dwellerId = dweller.id;
        let dwellerMotherId;
        let dwellerFatherId;
        let dwellerPartners;

        if (dweller.parentIds !== null) {
            dwellerMotherId = dweller.mother.id;
            dwellerFatherId = dweller.father.id;
        }

        if (dweller.partnerIds != null) {
            dwellerPartners = dweller.partnerIds;
        }

        let dwellerNode = {
            id: dwellerId,
            pids: dwellerPartners,
            mid: dwellerMotherId,
            fid: dwellerFatherId,
            name: dwellerName
        }

        dwellerNodeList.push(dwellerNode);
    }

    new FamilyTree(document.getElementById("tree"), {
        nodeBinding: {
            field_0: "name"
        },
        nodes: dwellerNodeList
    });
}