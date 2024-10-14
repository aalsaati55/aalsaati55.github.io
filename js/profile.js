async function loadProfile() {
  try {
    const { user, event_user } = await fetchUserProfile();
    displayUserInfo(user, event_user);
    displayAudits(user.audits);
    displayProgress(user.progresses);
    createAuditRatioGraph(user);
    createSkillsPieChart(user.skills);
    document.getElementById('profile-container').style.display = 'block';
  } catch (error) {
    console.error('Error loading profile:', error);
    document.getElementById('profile-container').innerHTML = `
      <p class="error">An error occurred while loading your profile. Please try again later.</p>
    `;
  }
}




function displayUserInfo(user, eventUser) {
  const userInfo = document.getElementById('user-info');
  userInfo.innerHTML = `
    <h2>Welcome, ${user.firstName + " " + user.lastName}!</h2>
    <p><strong>ID:</strong> ${user.id}</p>
    <p><strong>Username:</strong> ${user.login}</p>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Level:</strong> ${eventUser[0]?.level || 'N/A'}</p>
  `;
}


function displayAudits(audits) {
  const auditsDiv = document.getElementById('audits');
  const completedAudits = audits.nodes.filter(audit => audit.grade !== null);
 
  auditsDiv.innerHTML = '<h3>Your Audits</h3>' +
    '<p>Here you can find back all your audits : the ones you have to make and the ones you\'ve already made for other students projects.</p>' +
    completedAudits.map(audit => `
      <div class="audit-item">
        <p><strong>${audit.group.object.name}—${audit.group.captainLogin}</strong></p>
        <p class="${audit.grade >= 1 ? 'pass' : 'fail'}">${audit.grade >= 1 ? "PASS" : "FAIL"}</p>
      </div>
    `).join('');    
}




function displayProgress(progresses) {
  const progressDiv = document.getElementById('progress');
  const visibleProgresses = progresses.filter(p => p.grade >= 1);
  
  progressDiv.innerHTML = '<h3>Projects and Piscine Completion</h3>' +
    visibleProgresses.slice(0, 1000).map(p => `
      <div class="progress-item">
        <p><strong>${p.object.name}</strong></p>
        <p>Grade: Pass</p>
        <p>Starting Date: ${new Date(p.createdAt).toLocaleDateString()}</p>
        <p>Completed Date: ${new Date(p.updatedAt).toLocaleDateString()}</p>
      </div>
    `).join('');
}

