import PageManager from './page-manager';
import $ from 'jquery';
import {fb} from './common/firebase';
import utils from '@bigcommerce/stencil-utils';
import jsrender from 'jsrender'
import {IsAdmin} from './common/isadmin';
// var jsrender = require('jsrender');

// export const faq = {
//     init: function(){
//     }
// }
// faq.init();

export default class faq extends PageManager {

	loaded(next) {
		// this.admin();
		// this.getFaqs();
		// this.addFaq('category2','qq2','aa2')
		next();
	}

	admin() {
		const self = this;
		IsAdmin.check(function(authorized) {
			console.info('admin: ', authorized);
			window.admin = authorized;
			if(authorized) {
				self.rightClick();
			}
		});
	}

	getFaqs() {
		const self = this;
		return fb.subscribe('faqs').on('value', function(snapshot) {
            let data = snapshot.val();
            window.FAQs = data;
            // let ifData = Object.keys(data).length;
        	// if (data !== null){
        		self.renderCategories(data);
        	// }
        	// else {
        	// 	var categories = Object.values([data][0]);
        	// 	self.load_add_form(categories);
        	// }
        });
    };

    renderCategories(faqs) {
		// category tabs
		const self = this;
		var tmpl = $.templates("#tabs_markup");
		try {
			var categories = Object.values([faqs][0]);
		}catch(err) {
		    var categories = [];
		}
		var html = tmpl.render(categories); // ready for insertion...
		$('[data-tabs]').html(html);

		// category content
		var tmpl = $.templates("#category_markup");
		var html = tmpl.render(categories); // ready for insertion...
		$('[data-categories]').html(html);

		// category select (admin)
		this.load_add_form(categories);

		this.accordions();

		setTimeout( function() {
			self.tabListener();
		},500);
    }

    load_add_form(categories) {
    	if(admin) {
    		$('[data-categories-select] option.added').remove();
			var tmpl = $.templates("#category_select");
			var html = tmpl.render(categories); // ready for insertion...
			$('[data-categories-select]').append(html);
			this.category_selected();
		}
    }

    renderItems(catSlug) {
    	console.log(catSlug);
    	var tmpl = $.templates("#questions_markup");
		var questions = Object.values([FAQs[catSlug]][0]);
		var html = tmpl.render(questions); // ready for insertion...
		$('[data-questions-'+catSlug+']').html(html);
		this.accordions();
    }

    tabListener() {
    	const self = this;

    	// default to placing-an-order
		$(`[data-slug="placing-an-order"]`).closest('li').addClass('active');
		$('.tab-pane#placing-an-order').addClass('active');
		self.renderItems("placing-an-order")

		// trigger
    	$('[data-slug]').click( function() {
    		self.renderItems($(this).data('slug'))
    	});
    }

    addFaq(category,q,a) {
        let slug = this.slugify(category);
        let data = {q:q, a:a, in:slug};
        fb.post('faqs/'+slug, data);
        fb.write('faqs/'+slug+'/name', category);
        fb.write('faqs/'+slug+'/slug', slug);
    }

    updateFaq(target,q,a) {
        fb.write('faqs/'+target.path+'/q', q);
        fb.write('faqs/'+target.path+'/a', a);
    }

    removeFaq(path) {
        fb.remove("faqs/"+path);
    }

	slugify(Text){
	    return Text
			.toLowerCase()
			.replace(/ /g,'-')
			.replace(/[^\w-]+/g,'')
	    ;
	}

    accordions() {
  		$('.container.xx').removeClass('container');
		$('body.inside header').css('margin',0);
		//uses classList, setAttribute, and querySelectorAll
		//if you want this to work in IE8/9 youll need to polyfill these
		(function(){
		  var d = document,
		  accordionToggles = d.querySelectorAll('.js-accordionTrigger'),
		  setAria,
		  setAccordionAria,
		  switchAccordion,
		  touchSupported = ('ontouchstart' in window),
		  pointerSupported = ('pointerdown' in window);
		  
		  function skipClickDelay(e){
		    e.preventDefault();
		    e.target.click();
		  }

		    function setAriaAttr(el, ariaType, newProperty){
		    el.setAttribute(ariaType, newProperty);
		  };
		  function setAccordionAria(el1, el2, expanded){
		    switch(expanded) {
		      case "true":
		        setAriaAttr(el1, 'aria-expanded', 'true');
		        setAriaAttr(el2, 'aria-hidden', 'false');
		        break;
		      case "false":
		        setAriaAttr(el1, 'aria-expanded', 'false');
		        setAriaAttr(el2, 'aria-hidden', 'true');
		        break;
		      default:
		        break;
		    }
		  };
		//function
		function switchAccordion(e) {
		  e.preventDefault();
		  var thisAnswer = e.target.parentNode.nextElementSibling;
		  var thisQuestion = e.target;
		  if(thisAnswer.classList.contains('is-collapsed')) {
		    setAccordionAria(thisQuestion, thisAnswer, 'true');
		  } else {
		    setAccordionAria(thisQuestion, thisAnswer, 'false');
		  }
		    thisQuestion.classList.toggle('is-collapsed');
		    thisQuestion.classList.toggle('is-expanded');
		    thisAnswer.classList.toggle('is-collapsed');
		    thisAnswer.classList.toggle('is-expanded');
		  
		    thisAnswer.classList.toggle('animateIn');
		  };
		  for (var i=0,len=accordionToggles.length; i<len; i++) {
		    if(touchSupported) {
		      // accordionToggles[i].addEventListener('touchstart', skipClickDelay, false);
		    }
		    if(pointerSupported){
		      // accordionToggles[i].addEventListener('pointerdown', skipClickDelay, false);
		    }
		    accordionToggles[i].addEventListener('click', switchAccordion, false);
		  }
		})();
		// setTimeout( function(){
		// 	$('ul[role="tablist"] li:first a')[0].click();
		// },600);
    }

	category_selected() {
    	$('[data-categories-select]').on('change', function() {
		  if( this.value == 'new'){
		  	$("input#category").val('');
		  	$('p.p-new').removeClass('hide');
		  }else{
		  	$('p.p-new').addClass('hide');
		  	$('p.p-new input').val($(this).val());
		  }
		});
    }

    rightClick() {
		var scope = this;
		$('#faq').bind("contextmenu", function(event) {
		    event.preventDefault();
		    window.target = {
		    	id: $(event.target).data('id'),
		    	in: $(event.target).data('in'),
		    	question: $(event.target).html(),
		    	answer: $(event.target).closest('dt').next('dd').find('p').html(),
		    };
		    target['path'] = target.in+"/"+target.id;
			if(target.in !== undefined) {
				$('[data-categories-select]').val(target.in);
				$("#category").val(target.in);
				// $("#categoryS").attr("disabled", "disabled"); //Cant change category yet
				$("#question").val(target.question);
				$("#answer").val(target.answer);
				$('a.red').removeClass('hide');
				$('a.red').dblclick(function() {
					scope.removeFaq(target.path);
				});
			}else {
				// $("#categoryS").attr("disabled", "false"); //Can change category
				$('a.red').addClass('hide');
				$('form#contextForm input').not(':input[type=submit]').val('');
				$('[data-categories-select]').val($('[data-categories-select] option:first').val());
			}
		    $("ul.contextMenu")
		        .show()
		        .css({top: event.pageY + 15, left: event.pageX + 10});
		    
		});
		$(document).click(function() {
		  let isHovered = $("ul.contextMenu").is(":hover");
		  if (isHovered == false){
		    $("ul.contextMenu").fadeOut("fast");
		  }
		});
		$('#contextForm').submit( function(e){
			e.preventDefault();
			$("ul.contextMenu").fadeOut("fast");
			scope.contextSubmit($(this), target);
		})
	}

	contextSubmit(form, target){
		let d = {
			question: form.find("#question").val(),
			category: form.find("#category").val(),
			answer: form.find("#answer").val()
		}
		let slug = this.slugify(d.category);
		form.find('input').not(':input[type=submit]').val('');
		$('[data-categories-select]').val($('[data-categories-select] option:first').val());
		if(target.in === undefined) {
			this.addFaq(d.category, d.question, d.answer);
		}else {
			this.updateFaq(target, d.question, d.answer);
		}
	}



}








