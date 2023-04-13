//const consumerkey = ConsumerKeyandShareSecret.env.CANVAS_CONSUMER_KEY;
//const sharedsecret = ConsumerKeyandShareSecret.env.CANVAS_SHARED_SECRET;

// Set the Canvas API endpoint URL and access token
const apiUrl = 'https://otech.instructure.com/api/v1';
const accessToken = '2~xsaZy9gi2dJhTkZvAASVIujODfGThcLmlP8wVxaMcjDWA1lEhtQ9g7Yk3zR9pS48';

// Set the account ID and term ID for the courses you want to retrieve
const accountId = '8';
const termId = '1121';

// Make an API call to retrieve the current user's role in the course
$.ajax({
  url: `${apiUrl}/courses/${courseId}/users/self`,
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  },
  success: function(user) {
    // Check that the user has the instructor role before proceeding
    if (user.roles.includes('teacher') || user.roles.includes('admin')) {
      // Make an API call to retrieve the list of courses in the term
      $.ajax({
        url: `${apiUrl}/accounts/${accountId}/terms/${termId}/courses?per_page=100`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        success: function(courses) {
          // Loop through each course and make an API call to retrieve the completion information
          courses.forEach(course => {
            $.ajax({
              url: `${apiUrl}/courses/${course.id}/analytics/completion/completion_rates`,
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${accessToken}`
              },
              success: function(completionData) {
                // Display the completion data for the course
                const courseHtml = `
                  <div class="course">
                    <h2>${course.name}</h2>
                    <p>Completion rate: ${completionData.completion_rate}%</p>
                  </div>
                `;
                $('#completion-data').append(courseHtml);
              },
              error: function(error) {
                console.error(`Error retrieving completion data for course ${course.name}:`, error);
              }
            });
          });
        },
        error: function(error) {
          console.error('Error retrieving course data:', error);
        }
      });
    } else {
      // Display an error message if the user does not have the instructor role
      $('#completion-data').html('<p>You do not have permission to view this information.</p>');
    }
  },
  error: function(error) {
    console.error('Error retrieving user data:', error);
  }
});
