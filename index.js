let URL = "https://fallout-shelter-family-tree.herokuapp.com/vault";

let submitButton = document.querySelector("#submitButton");
submitButton.addEventListener("click", () => {
    const importedFile = document.getElementById('import-file').files[0];
    if (importedFile !== undefined) {
        importFile(importedFile);
    }
})

function importFile(file) {
    const reader = new FileReader();
    reader.onload = function() {
        let vaultData = (reader.result);

        fetch(URL, {
            method:"POST",
            body:vaultData,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => handleDwellerData(data))
            .catch(error => console.log(error));
    };
    reader.readAsText(file);
}

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