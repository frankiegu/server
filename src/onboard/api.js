export const postOnboardData = data =>
  fetch('/onboard', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(data)
  }).then(res => res.json());

