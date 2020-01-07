(function($){
  $(function() {

	tinymce.PluginManager.add('custom_btn', function( editor, url ) {
	  editor.addButton('ads', {
		text: '廣告標示',
		icon: false,
		onclick: function() {
			// change the shortcode as per your requirement
			// editor.insertContent('<ul><li><li><ul>');
			let iframe_id = $('.mce-container iframe').attr("id")
			let selobj = document.getElementById(iframe_id).contentWindow.getSelection();
			// selobj.parentElement.style.cssText = "font-size: 18px;color: #3c4b89;border-top: 2px solid;border-bottom: 2px solid;padding: 12px 10px;display: inline-block;letter-spacing: 1px;font-weight: 700;" ;
			let selRange = selobj.getRangeAt(0);
			if( selRange.commonAncestorContainer.parentElement.nodeName != "BODY" ) {
			  selRange.commonAncestorContainer.parentElement.style.cssText = "font-size: 18px;color: #3c4b89;border-top: 2px solid;border-bottom: 2px solid;padding: 12px 10px;display: inline-block;letter-spacing: 1px;font-weight: 700;";
			}
			// selRange.commonAncestorContainer.classList.add('ads');
		}
	  });
	  editor.addButton('blockquote2', {
		text: 'blockquote2',
		icon: false,
		onclick: function() {
		  let iframe_id = $('.mce-container iframe').attr("id")
		  let selobj = document.getElementById(iframe_id).contentWindow.getSelection();
		  let selRange = selobj.getRangeAt(0);
		  if( selRange.commonAncestorContainer.parentElement.nodeName != "BODY" ) {
			selRange.commonAncestorContainer.parentElement.style.cssText = "font-size: 22px;line-height: 31px;font-weight: bold;color: #3c4b89;";
		  }
		}
	  });
	  editor.addButton('item2', {
		text: '項目2',
		icon: false,
		onclick: function() {
		  let iframe_id = $('.mce-container iframe').attr("id")
		  //獲得選取的物件
		  let selobj = document.getElementById(iframe_id).contentWindow.getSelection();
		  let selRange = selobj.getRangeAt(0);
		  //變更選取物件的CSS
		  selRange.commonAncestorContainer.style.cssText = "font-size: 16px;padding-bottom: 28px;";
		  selRange.commonAncestorContainer.childNodes.forEach(function(e,index,item) { 
			item[index].style.cssText = "line-height: 32px;";
		  });
		}
	  });
	  editor.addButton('num2', {
		text: '編號2',
		icon: false,
		onclick: function() {
		  let iframe_id = $('.mce-container iframe').attr("id")
		  //獲得選取的物件
		  let selobj = document.getElementById(iframe_id).contentWindow.getSelection();
		  let selRange = selobj.getRangeAt(0);
		  //變更選取物件的CSS
		  selRange.commonAncestorContainer.childNodes.forEach(function(e,index,item) { 
			item[index].style.cssText = "line-height: 32px;";
		  });
		}
	  });
	  editor.addButton('carousel', {
		  text: '輪',
		  cmd   : 'add_carousel_cmd',
		  title : editor.getLang( 'custom_btn.buttonTitle', '建立輪播' ),
	  });
	  editor.addButton('related_articles', {
		  text: '文',
		  cmd   : 'add_related_articles_cmd',
		  title : editor.getLang( 'custom_btn.buttonTitle', '建立關聯文章' ),
	  });

	  editor.addButton('external_related_articles', {
		  text: '文(外)',
		  cmd   : 'add_external_related_articles_cmd',
		  title : editor.getLang( 'custom_btn.buttonTitle', '建立外部關聯文章' ),
	  });

	  editor.addCommand('add_carousel_cmd', function() {
		//declare variables
		let frame,
		carousel_src = [],
		carousel_id = [],
		dialog = $('#carousel_set'),
		body = $("body");

		//If dialog exists, open it.
		if( dialog.length != 0 ) {
		  dialog.dialog({
			width: 500,
			modal: true
		  });
		  return;
		}

		//Create dialog element
		$('body').append(`<div id="carousel_set" title="輪播設定"></div>`)

		//Get dialog DOM
		dialog = $('#carousel_set')

		//Create img list container
		dialog.append(`<div class="img_container"><span class="upload_img">Set Carousel</span></div>`)

		//Create confirm btn
		dialog.append(`<button type="button" class="confirm_btn hiden">確認</button>`)

		//Get dialog controller DOM
		add_img_btn = $('#carousel_set .upload_img'),
		delImgLink = $( '#carousel_set .delete_img_link'),
		imgContainer = $('#carousel_set .img_container'),
		confirm_btn = $( '.confirm_btn' )

		// ADD IMAGE LINK
		body.on( 'click', '#carousel_set .upload_img',function( event ){
		  event.preventDefault();
		  
		  // If the media frame already exists, reopen it.
		  if ( frame ) {
			frame.open();
			return;
		  }
		  
		  // Create a new media frame
		  frame = wp.media({
			title: 'Select or Upload Media Of Your Chosen Persuasion',
			button: {
			  text: 'Use this media'
			},
			multiple: true  // Set to true to allow multiple files to be selected
		  });
		  
		  // When an image is selected in the media frame...
		  frame.on('select', function() {
			
			// Get media attachment details from the frame state
			let attachment = frame.state().get('selection').toJSON();

			imgContainer.html( `<p>${attachment.length} Images Selected <span class="delete_img_link">(Clear)</span></p>` )

			attachment.forEach(function(element, index) {
			  // Send the attachment URL to our custom image input field.
			  imgContainer.append( `
				<div>
				  <img src="${element.url}" title="${element.title}">
				  <input type="text" placeholder="目標連結" name="carousel_link[]">
				</div>
			  ` );

			  //Add elements src,id to the carousel_src,carousel_id array
			  carousel_src.push(element.url)
			  carousel_id.push(element.id)
			})
			//If selected media image,show the confirm btn
			confirm_btn.removeClass('hiden');
		  });
		  // Finally, open the modal on click
		  frame.open();
		});
			
		// DELETE IMAGE LINK
		$("#carousel_set").on( 'click', '.delete_img_link',function( event ){
		  event.preventDefault();

		  // Clear out the preview image
		  imgContainer.html( '<span class="upload_img">Set Carousel</span>' );

		  //Hiden confirm btn
		  confirm_btn.addClass('hiden');
		});

		//After confirmed...
		$("#carousel_set").on( 'click', '.confirm_btn', function( event) {
		  let carousel_link = $('input[name="carousel_link[]"]');

		  //insert bs_carousel shortcode
		  editor.insertContent('[bs_carousel]');

		  carousel_link.each(function(index) {
			//insert bs_carousel_item shortcode
			let link = $(this).val() || '';
			editor.insertContent(`[bs_carousel_item src="${carousel_src[index]}" link="${link}" id="${carousel_id[index]}"][/bs_carousel_item]`);
		  })
		  
		  editor.insertContent('[/bs_carousel]');

		  //Reset img container
		  imgContainer.html( '<span class="upload_img">Set Carousel</span>' );

		  confirm_btn.addClass('hiden');

		  //After confirmed close dialog
		  dialog.dialog("close")
		})

		dialog.dialog({
		  width: 500,
		  modal: true
		});
	  });

	  editor.addCommand('add_related_articles_cmd', function() {
		// let dialog = $('#related_articles_set'),
		// body = $("body");
		// if(dialog.length > 0) {
		//   dialog.dialog({
		//	 width: 500,
		//	 modal: true
		//   });
		//   return;
		// }

		// body.append(`<div id="related_articles_set" title="關聯文章設定"></div>`)

		// dialog = $('#related_articles_set')

		// dialog.append(`
		//   <div>
		//	 <label>文章</label>
		//	 <input type="text" name="post_ids"/>
		//   </div>`)

		// dialog.dialog({
		//	 width: 500,
		//	 modal: true
		//   });
		let post_ids = prompt('輸入文章ID以,分隔(例 101,1,3)');
		if( post_ids ) {
		  post_ids = post_ids.split(',')

		  for(let i=0; i<post_ids.length;i++) {
			editor.insertContent(`[related_articles id="${post_ids[i]}"][/related_articles]`);
		  }
		  
		}
	  });

	  editor.addCommand('add_external_related_articles_cmd', function() {

		let external_articles_dialog = $('#external_articles_dialog');

		//If dialog already exists,opne it !
		if( external_articles_dialog.length != 0 ) {
		  external_articles_dialog.dialog({
			width: 400,
			height: 300,
			modal: true
		  });
		  return;
		}
		//Create dialog
		$('body').append(`<div id="external_articles_dialog" title="外部文章設定">`);

		external_articles_dialog = $('#external_articles_dialog');

		// dialog content
		external_articles_dialog.append(
		  `<div class="external_articles_content">
			<div>
			  <label for="external_img">圖片連結：</label>
			  <input type="text" name="external_img"/>
			</div>
			<div>
			  <label for="external_link">文章連結：</label>
			  <input type="text" name="external_link"/>
			</div>
			<div>
			  <label for="external_title">標題：</label>
			  <input type="text" name="external_title"/>
			</div>
			<div>
			  <label for="external_preface">前言：</label>
			  <textarea name="external_preface" id="external_preface" cols="30" rows="3"></textarea>
			</div>
		  </div>`)

		external_articles_dialog.append(`<button type="button" class="confirm_btn hiden">確認</button>`)

		//click confirm btn event
		$("#external_articles_dialog").on( 'click', '.confirm_btn', function( event) {
		  let external_img = $('input[name="external_img"]').val() || '';
		  let external_link = $('input[name="external_link"]').val() || '';
		  let external_title = $('input[name="external_title"]').val() || '';
		  let external_preface = $('textarea[name="external_preface"]').val() || '';

		  let related_articles_attr = `type="external" external_img="${external_img}" external_link="${external_link}" external_title="${external_title}" external_preface="${external_preface}"`;
		  //insert bs_carousel shortcode
		  editor.insertContent('[related_articles '+ related_articles_attr+']');
		  editor.insertContent('[/related_articles]');

		  //After confirmed close dialog
		  external_articles_dialog.dialog("close")
		  $('input[name="external_img"]').val('')
		  $('input[name="external_link"]').val('')
		  $('input[name="external_title"]').val('')
		  $('input[name="external_preface"]').val('')
		})


		external_articles_dialog.dialog({
		  width: 400,
		  height: 300,
		  modal: true
		});
	  });
	});

	//tinymce-line-height
	(function(e){e.PluginManager.add("lineheight",function(t,n,r){t.on("init",function(){t.formatter.register({lineheight:{inline:"span",styles:{"line-height":"%value"}}})});t.addButton("lineheight",function(){var n=[],r="8px 10px 12px 14px 18px 24px 32px 36px";var i=t.settings.lineheight_formats||r;i.split(" ").forEach(function(e){var t=e,r=e;var i=e.split("=");if(i.length>1){t=i[0];r=i[1]}n.push({text:t,value:r})});return{type:"listbox",text:"行距",tooltip:"Line Height",values:n,fixedWidth:true,onPostRender:function(){var e=this;t.on("nodeChange",function(r){var i="lineheight";var s=t.formatter;var o=null;r.parents.forEach(function(e){n.forEach(function(t){if(i){if(s.matchNode(e,i,{value:t.value})){o=t.value}}else{if(s.matchNode(e,t.value)){o=t.value}}if(o){return false}});if(o){return false}});e.value(o)})},onselect:function(t){e.activeEditor.formatter.apply("lineheight",{value:this.value()})}}})});e.PluginManager.requireLangPack("lineheight","de")})(tinymce)
  })
})(jQuery)
