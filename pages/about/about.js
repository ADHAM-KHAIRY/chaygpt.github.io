async function loadData() {
    let res = await fetch('data.json');  
    let data = await res.json();         
    console.log(data)
    return data;                      
}

async function getDevelopersData() {
    let developersData = await loadData(); 
    developersData.forEach(developerData => {
        let grid = document.getElementsByClassName("team-grid")[0]
        let developer = document.createElement("div")
        developer.classList.add("team-member")

        developer.innerHTML = `
            <img src="${developerData.image}" alt="${developerData.name}">
            <h3>${developerData.name}</h3>
                <div class="member-details">
                        <p class="member-label">Contributions:</p>
                        <p class="member-value">${developerData.contributions} Lines</p>
                        <p class="member-label">Pages:</p>
                        <p class="member-value">${developerData.pages}</p>
                </div>
                    <p class="skills-title">Skills</p>
                    <div class="skills-grid">
                        ${developerData.skills.map(skill => `<img src="../../images/${skill.toLowerCase()}.png" alt="${skill}">`).join('')}
                    </div>
        `
        grid.appendChild(developer)
    });
}
getDevelopersData();
