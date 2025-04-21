async function getDevelopersData() {
    async function loadData() {
        let res = await fetch('data.json');  
        let data = await res.json();         
        return data;                      
    }

    let developersData = await loadData(); 
    developersData.forEach(developerData => {
        let grid = document.getElementsByClassName("team-grid")[0];
        let developer = document.createElement("div");
        developer.classList.add("team-member");

        developer.innerHTML = `
            <img src="${developerData.image}" alt="${developerData.name}">
            <h3>${developerData.name}</h3>
                <div class="member-details">
                        <p class="member-label">Contributions:</p>
                        <p class="member-value lines-count" data-username="${developerData.github}">Loading....</p>
                        <p class="member-label">Pages:</p>
                        <p class="member-value">${developerData.pages}</p>
                </div>
                    <p class="skills-title">Skills</p>
                    <div class="skills-grid">
                        ${developerData.skills.map(skill => `<img src="../../images/${skill.toLowerCase()}.png" alt="${skill}">`).join('')}
                    </div>
        `;
        grid.appendChild(developer);
    });
}

async function loadlines() {
    async function loadData() {
        const url = "https://api.github.com/repos/ADHAM-KHAIRY/chaygpt.github.io/stats/contributors";
        const res = await fetch(url);  
        if (res.status === 202) {
            console.log("GitHub is generating the stats... retrying in 3s");
            await new Promise(r => setTimeout(r, 3000));
            return loadData(); 
        }
        return res.json();
        }
        const data = await loadData();
        
        data.forEach(contributor => {
            const username = contributor.author.login;
            const additions = contributor.weeks.reduce((sum, week) => sum + week.a, 0);
            console.log(username)
            
            const linesElements = document.querySelectorAll(`.lines-count[data-username="${username}"]`);
            linesElements.forEach(el => {
                el.innerHTML = `${additions} Lines`;
            });
            
            
        });    
}

async function main() {
    await getDevelopersData();
    await loadlines();
}
main();