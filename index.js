let URL = "https://fallout-shelter-family-tree.herokuapp.com/vault";

let submitButton = document.querySelector("#submitButton");
submitButton.addEventListener("click", () => {
    const importedFile = document.getElementById('import-file').files[0];
    if (importedFile !== undefined) {
        importFile(importedFile);
    }
})

let startTime, interval, totaltime;

function start(){
    startTime = Date.now();
    interval = setInterval(function(){
        var elapsedTime = Date.now() - startTime;
        totaltime = (elapsedTime / 1000).toFixed(3);
    });
}

function stop(){
    clearInterval(interval);
    return totaltime;
}

function importFile(file) {
    const reader = new FileReader();
    reader.onload = function() {
        let vaultData = (reader.result);

        start();

        fetch(URL, {
            method:"POST",
            body:vaultData,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => {
                handleDwellerData(data)

                let timeItTook = stop();
                document.querySelector(".elapsed-time").textContent = "It took " + timeItTook + "ms to fetch the results."
            })
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
        let dwellerGender = dweller.gender;
        let dwellerChildren = [];

        let childrenURL = "https://fallout-shelter-family-tree.herokuapp.com/vault/family/" +dwellerId;

        fetch(childrenURL, {
            method:"GET"
        })
            .then(res => res.json())
            .then(childData => {
                for (let i = 0; i < childData.length; i++) {
                    let childname = childData[i].firstName + " " + childData[i].lastName;
                    dwellerChildren.push(childname);
                }
            })
            .catch(error => console.log(error));


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
            name: dwellerName,
            gender: dwellerGender,
            children: dwellerChildren
        }

        dwellerNodeList.push(dwellerNode);
    }

    new FamilyTree(document.getElementById("tree"), {
        scaleInitial: FamilyTree.match.boundary,
        miniMap: true,
        nodeBinding: {
            field_0: "name"
        },
        nodes: dwellerNodeList
    });
}