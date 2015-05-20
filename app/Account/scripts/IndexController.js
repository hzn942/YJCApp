angular
  .module('Account')
  .controller("IndexController", function ($scope, supersonic) {    


    $scope.advisorFirstName = [];
    $scope.advisorLastName = [];
    $scope.advisorFullName = [];
    $scope.advisorEmail = [];
    $scope.Account = {};

    supersonic.ui.views.current.whenVisible( function () {
      
      var advisor = Parse.Object.extend("Advisor");
      var query = new Parse.Query(advisor);
      query.find({
        success: function(results) {
          $scope.advisorFirstName = [];
          $scope.advisorLastName = [];
          $scope.advisorFullName = [];
          $scope.advisorEmail = [];
          if (results.length === 0)
          {
            $scope.advisorFullName.push("No Advisors");
            $scope.advisorFirstName.push("No Advisors");
            $scope.advisorLastName.push("No Advisors");
            $scope.advisorEmail.push("No Advisors");
          }

          for (var i = 0; i < results.length; i++)
          {
            $scope.advisorFirstName.push(results[i].get("firstName"));
            $scope.advisorLastName.push(results[i].get("lastName"));
            $scope.advisorFullName.push(results[i].get("firstName") + " " + results[i].get("lastName"));
            $scope.advisorEmail.push(results[i].get("email")); 
            $scope.Account.advisorFullName = $scope.advisorFullName[0];
            $scope.$apply();
          }
        },
        error: function(results) {

        }
      });

      var user = Parse.Object.extend("User");
      query = new Parse.Query(user);


      query.equalTo("objectId", Parse.User.current().id);
      query.first({
        success: function(results) {
          $scope.Account.skills = [];
          $scope.interests = [];
          $scope.Account.education = [];
          $scope.Account.timeAvailable = [];
          $scope.currentUser = results;
          $scope.Account.firstName = $scope.currentUser.get('firstName');
          $scope.Account.lastName = $scope.currentUser.get('lastName');
          $scope.Account.phoneNumber = $scope.currentUser.get('phoneNumber');
          $scope.Account.zipcode = $scope.currentUser.get('zipcode');
          $scope.Account.dateOfBirth = $scope.currentUser.get('dateOfBirth');
          $scope.Account.criminalHistory = $scope.currentUser.get('criminalHistory');
          $scope.Account.advisorEmail = $scope.currentUser.get('advisorEmail');
          $scope.Account.jobRadius = $scope.currentUser.get('jobRadius');
          // get job radius
          if ($scope.Account.jobRadius)
          {
            var id = $scope.currentUser.get('jobRadius');
            id = "#d" + id;
            $(id).prop("checked", true);
          }

          // array values
          $scope.Account.interests = $scope.currentUser.get("interests");
          $scope.Account.education = $scope.currentUser.get("education");
          $scope.Account.timeAvailable = $scope.currentUser.get("timeAvailable");

          // if date of birth is not set, set todays date as a value
          if ($scope.Account.dateOfBirth === null || $scope.Account.dateOfBirth === undefined)
            $('#dateofbirth').val(new Date().toDateInputValue());
          else
            $('#dateofbirth').val($scope.Account.dateOfBirth.toDateInputValue());

          // get interests array data
          for (var i = 0; i < $scope.Account.interests.length; i++)
          {
            var id = $scope.Account.interests[i].replace(/ /g,'').toLowerCase().replace(/[^a-z]/g, "");
            id = '#' + id;
            $(id).prop("checked", true);
          }
          // get education array data
          for (i = 0; i < $scope.Account.education.length; i++)
          {
            var id = $scope.Account.education[i].replace(/ /g,'').toLowerCase().replace(/[^a-z]/g, "");
            id = '#' + id;
            $(id).prop("checked", true);
          }
          // get time available 
          for (i = 0; i < $scope.Account.timeAvailable.length; i++)
          {
            var id = $scope.Account.timeAvailable[i].replace(/ /g,'').toLowerCase().replace(/[^a-z0-9]/g, "");
            id = '#' + id;
            $(id).prop("checked", true);
          }
          // get criminal history
          if ($scope.Account.criminalHistory === true)
            $('#hascriminal').prop("checked", true);
          else
            $('#hascriminal').prop("checked", false);
          $scope.$apply();
        },
        error: function(error) {
          //alert("Error: " + error.code + " " + error.message);
        }
      });
    });

    // Controller functionality here
    $scope.selectAll = function () {
      if ($('#all').prop("checked") === true)
        $("#industries :input").prop("checked", true);
      else
        $("#industries :input").prop("checked", false);
    };  

    $scope.checkForm = function () {
      var numErrors = 0;
      $('#firstname-lbl').removeClass('error-input');
      $('#lastname-lbl').removeClass('error-input');
      $('#phonenumber-lbl').removeClass('error-input');
      $('#zipcode-lbl').removeClass('error-input');
      $('#advisor-lbl').removeClass('error-input');

      if ($('#firstname').val() === '' || $('#firstname').val() === undefined || $('#firstname').val() === null)
      {
        numErrors++;
        $('#firstname-lbl').addClass('error-input');
      }
      if ($('#lastname').val() === '' || $('#lastname').val() === undefined || $('#lastname').val() === null)
      {
        numErrors++;
        $('#lastname-lbl').addClass('error-input');
      }
      if ($('#phonenumber').val() === '' || $('#phonenumber').val() === undefined || $('#phonenumber').val() === null)
      {
        numErrors++;
        $('#phonenumber-lbl').addClass('error-input');
      }
      if ($('#zipcode').val() === '' || $('#zipcode').val() === undefined || $('#zipcode').val() === null)
      {
        numErrors++;
        $('#zipcode-lbl').addClass('error-input');
      }
      if (numErrors === 0)
      {
        $scope.addNewAccount();
      }
    };
    
    $scope.addNewAccount = function () {   
      // get new dob
      var startDate = $('#dateofbirth').val().split("-");
      startDate[0] = parseInt(startDate[0]);
      startDate[1] = parseInt(startDate[1]) - 1;
      startDate[2] = parseInt(startDate[2]);
      $scope.Account.dateOfBirth = new Date(startDate[0], startDate[1], startDate[2]);
      // get industries
      $scope.Account.interests = [];
      $('#industries').find('input').each(function(i, element)
      {
        if ($(element).prop("checked"))
        {
          var parent = element.parentNode.parentNode;
          $scope.Account.interests.push($(parent).text().trim());
        }
      });
      // get education
      $scope.Account.education = [];
      $('#education').find('input').each(function(i, element)
      {
        if ($(element).prop("checked"))
        {
          var parent = element.parentNode.parentNode;
          $scope.Account.education.push($(parent).text().trim());
        }
      });
      // get skills
      $scope.Account.skills = [];
      $('#standardskills').find('input').each(function(i, element)
      {
        if ($(element).prop("checked"))
        {
          var parent = element.parentNode.parentNode;
          $scope.Account.skills.push($(parent).text().trim());
        }
      });
      // criminal history
      if ($('#hascriminal').prop("checked"))
        $scope.Account.criminalHistory = true;
      // get time available
      $scope.Account.timeAvailable = [];
      $('#timeavailable').find('input').each(function(i, element)
      {
        if ($(element).prop("checked"))
        {
          var parent = element.parentNode.parentNode;
          $scope.Account.timeAvailable.push($(parent).text().trim());
        }
      });
      $scope.currentUser.set("firstName", $scope.Account.firstName);
      $scope.currentUser.set("lastName", $scope.Account.lastName);
      $scope.currentUser.set("phoneNumber", $scope.Account.phoneNumber);
      $scope.currentUser.set("dateOfBirth", $scope.Account.dateOfBirth);
      $scope.currentUser.set("zipcode", $scope.Account.zipcode);
      $scope.currentUser.set("criminalHistory", $scope.Account.criminalHistory);
      $scope.currentUser.set("interests", $scope.Account.interests);
      $scope.currentUser.set("skills", $scope.Account.skills);
      $scope.currentUser.set("education", $scope.Account.education);
      $scope.currentUser.set("timeAvailable", $scope.Account.timeAvailable);

      var index = $scope.advisorFullName.indexOf($scope.Account.advisorFullName);
      $scope.currentUser.set("advisorFirstName", $scope.advisorFirstName[index]);
      $scope.currentUser.set("advisorLastName", $scope.advisorLastName[index]);
      $scope.currentUser.set("advisorEmail", $scope.advisorEmail[index]);
      $scope.Account.jobRadius = parseInt($('input[name=distance]:checked').val());
      $scope.currentUser.set("jobRadius", $scope.Account.jobRadius);


      $scope.currentUser.set("advisorEmail", $scope.Account.advisorEmail);

      $scope.currentUser.save(null, {
        success: function(user) {
        },
        error: function(user, error) {
        }
      }); 
      supersonic.ui.layers.pop();
    };	

    $scope.showSkillsInput = function() {
      var skill = document.getElementById("skill");
      var skillval = skill.value;

      var newli = document.createElement("li");
      newli.className = "item item-checkbox";

      var text = document.createTextNode(skillval);

      var newlbl = document.createElement("label");
      newlbl.className = "checkbox";

      var newinput = document.createElement("input");
      newinput.setAttribute("id", skillval.replace(/ /g,'').toLowerCase().replace(/[^a-z1-9]/g, ""));
      newinput.setAttribute("type", "checkbox");
      newinput.setAttribute("checked", true);

      newlbl.appendChild(newinput);
      newli.appendChild(newlbl);
      newli.appendChild(text);
      document.getElementById("standardskills").appendChild(newli);

      
      document.getElementById("skill").value = '';     
    };
});

