function isValidJWT(token) {
  return token && typeof token === 'string' && token.split('.').length === 3;
}

async function fetchUserProfile() {
  const token = localStorage.getItem('jwt');
  if (!isValidJWT(token)) {
    localStorage.removeItem('jwt');
    throw new Error('Invalid token format');
  }

  let userId;
  try {
    userId = getUserIdFromToken(token);
  } catch (error) {
    console.error('Error getting user ID:', error);
    throw new Error('Failed to extract user ID from token');
  }

  const eventId = 20;

  const query = `
  query($userId: Int!, $eventId: Int!) {
    user(where: {id: {_eq: $userId}}) {
      id
      login
      firstName
      lastName
      email
      auditRatio
      totalUp
      totalDown
      audits: audits_aggregate(
        where: {
          auditorId: {_eq: $userId},
          grade: {_is_null: false}
        },
        order_by: {createdAt: desc}
      ) {
        nodes {
          id
          grade
          createdAt
          group {
            captainLogin
            object {
              name
            }
          }
        }
      }
      progresses(where: { userId: { _eq: $userId }, object: { type: { _in: ["project", "piscine"] } } }, order_by: {updatedAt: desc}) {
        id
        object {
          id
          name
          type
        }
        grade
        createdAt
        updatedAt
      }
      skills: transactions(
        order_by: [{type: desc}, {amount: desc}]
        distinct_on: [type]
        where: {userId: {_eq: $userId}, type: {_in: ["skill_js", "skill_go", "skill_html", "skill_prog", "skill_front-end", "skill_back-end"]}}
      ) {
        type
        amount
      }
    }
    event_user(where: { userId: { _eq: $userId }, eventId: {_eq: $eventId}}) {
      level
    }
  }
  `;

  const response = await fetch('https://learn.reboot01.com/api/graphql-engine/v1/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ 
      query,
      variables: {
        userId: userId,
        eventId: eventId
      }
    })
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profile data');
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(data.errors[0].message);
  }

  if (!data.data || !data.data.user || data.data.user.length === 0) {
    throw new Error('No user data found');
  }

  return {
    user: data.data.user[0],
    event_user: data.data.event_user
  };
}

function getUserIdFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload && payload.sub) {
      return parseInt(payload.sub, 10);
    }
    throw new Error('User ID not found in token');
  } catch (error) {
    console.error('Error parsing token:', error);
    throw new Error('Invalid token structure');
  }
}

