'use strict';

const articleView = {};

articleView.populateFilters = () => {
  $('article').each(function() {
    if (!$(this).hasClass('template')) {
      let val = $(this).find('address a').text();
      let optionTag = `<option value="${val}">${val}</option>`;

      if ($(`#author-filter option[value="${val}"]`).length === 0) {
        $('#author-filter').append(optionTag);
      }

      val = $(this).attr('data-category');
      optionTag = `<option value="${val}">${val}</option>`;
      if ($(`#category-filter option[value="${val}"]`).length === 0) {
        $('#category-filter').append(optionTag);
      }
    }
  });
};

articleView.handleAuthorFilter = () => {
  $('#author-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-author="${$(this).val()}"]`).fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#category-filter').val('');
  });
};

articleView.handleCategoryFilter = () => {
  $('#category-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-category="${$(this).val()}"]`).fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#author-filter').val('');
  });
};

articleView.handleMainNav = () => {
  $('.main-nav').on('click', '.tab', function() {
    $('.tab-content').hide();
    $(`#${$(this).data('content')}`).fadeIn();
  });

  $('.main-nav .tab:first').click();
};

articleView.setTeasers = () => {
  $('.article-body *:nth-of-type(n+2)').hide();
  $('article').on('click', 'a.read-on', function(e) {
    e.preventDefault();
    if ($(this).text() === 'Read on →') {
      $(this).parent().find('*').fadeIn();
      $(this).html('Show Less &larr;');
    } else {
      $('body').animate({
        scrollTop: ($(this).parent().offset().top)
      },200);
      $(this).html('Read on &rarr;');
      $(this).parent().find('.article-body *:nth-of-type(n+2)').hide();
    }
  });
};

// COMMENTED: When/where is this function invoked? What event ultimately triggers its execution? Explain the sequence of code execution when this function is invoked.
// The function is invoked in the new.html page and initialised/triggered when the new.html page loads. .tab-content will show when the page load occurs and the #export-field will hide. The #article-json event will happen when we tab/activate it, when that happens a function will run to select that element. Next,listen for an event on the #new-form for a change, or for the tab to be on any input or textarea that's new-form's children, or submit, and a function to create a #new-form will happen. 
articleView.initNewArticlePage = () => {
  $('.tab-content').show();
  $('#export-field').hide();
  $('#article-json').on('focus', function(){ //attaches an event listener and expects type of method its listening for/making active (tabbing) and a function for when that happens
    this.select();
  });

  $('#new-form').on('change', 'input, textarea', articleView.create); //listening to new form element going to listen to children, when either of those change run that function.
  $('#new-form').on('submit', articleView.submit);
};

// COMMENTED: When is this function called? What event ultimately triggers its execution?
// The function is called in the above function (initNewArticlePage). It is triggered when the event occurs on change or any input or textarea that's new-form's children gets triggered, then the articleView.create function will execute.
articleView.create = () => {
  let article;
  $('#articles').empty();

  article = new Article({
    title: $('#article-title').val(),
    author: $('#article-author').val(),
    authorUrl: $('#article-author-url').val(),
    category: $('#article-category').val(),
    body: $('#article-body').val(),
    publishedOn: $('#article-published:checked').length ? new Date() : null
  });

  $('#articles').append(article.toHtml());

  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });

  $('#export-field').show();
  $('#article-json').val(`${JSON.stringify(article)},`);
};

// COMMENTED: When is this function called? What event ultimately triggers its execution?
// It is called in the new.html when the submit button is clicked for the new form.
articleView.submit = event => {
  event.preventDefault();
  let article = new Article({
    title: $('#article-title').val(),
    author: $('#article-author').val(),
    authorUrl: $('#article-author-url').val(),
    category: $('#article-category').val(),
    body: $('#article-body').val(),
    publishedOn: $('#article-published:checked').length ? new Date() : null
  });

  // COMMENTED: Where is this function defined? When is this function called? What event ultimately triggers its execution?
  // It is defined in article.js in the prototype method attached to the Article constructor. It is called below in articleView.js. It is triggered when the submit button is clicked on the form by the user.
  article.insertRecord();
}

articleView.initIndexPage = () => {
  Article.all.forEach(article => { //Article is an object with propertes (key/value pair), has a property all (array of article instances (run new Article and store that in something)). For each goes through the array and runs a function. That function needs to except atleast 1 thing, item in position 0...for each instance pass through item in array.
    $('#articles').append(article.toHtml()) //will append (wants a string of proper HTML) to the #articles element the result of calling toHTML on that article. Converts string into real Html and adds it to the DOM (#articles element).
  });

  articleView.populateFilters();
  articleView.handleCategoryFilter();
  articleView.handleAuthorFilter();
  articleView.handleMainNav();
  articleView.setTeasers();
};
