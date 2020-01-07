<?php 
class Shortcodes {
	public function bootstrap_carousel( $atts, $content = null ) {
		global $bootstrap_carusel_item;
		do_shortcode( $content );
		$output = '<div id="issue_carousel" class="carousel slide" data-ride="carousel">';

		$output .= '<div class="carousel-inner" role="listbox">';
		foreach ( $bootstrap_carusel_item as $key => $value ) {
			$active = 0 === $key ? 'active' : '';
			$output .= '<div class="item ' . $active . '">' . $value . '</div>';
		}

		$output .= '<!-- Indicators --><ol class="carousel-indicators">';

		foreach ( $bootstrap_carusel_item as $key => $value ) {
			$active = 0 === $key ? 'active' : '';
			$output .= '<li class="' . $active . '" data-target="#issue_carousel" data-slide-to="' . $key . '"></li>';
		}

		$output .= '</ol>';
		$output .= '</div>
		<a class="left carousel-control" href=".carousel" role="button" data-slide="prev">
			<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
			<span class="sr-only">Previous</span>
		</a>
		<a class="right carousel-control" href=".carousel" role="button" data-slide="next">
			<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
			<span class="sr-only">Next</span>
		</a>
		</div>';
		$bootstrap_carusel_item = '';
		return $output;
	}

	public function bootstrap_carusel_item( $atts, $content = null ) {
		global $bootstrap_carusel_item;

		extract( shortcode_atts( array(
			'id' => '',
			'src' => '',
			'link' => '',
			'title' => ''
		), $atts ) );
		if ( '#' === $link || empty( $link ) ) {
			$bootstrap_carusel_item[] = '
			<img src="' . $src . '"/>
			<div class="carousel-caption">' . wp_get_attachment_caption( $id ) . '</div>';
		} else {
			$bootstrap_carusel_item[] = '<a href="' . $link . '">
			<img src="' . $src . '"/>
			<div class="carousel-caption">' . wp_get_attachment_caption( $id ) . '</div></a>';
		}
	}

	public function related_articles_func( $atts, $content = null ) {
		extract( shortcode_atts( array(
			'id' => '',
			'type' => '',
			'external_img' => '',
			'external_link' => '',
			'external_title' => '',
			'external_preface' => ''
		), $atts ) );

		if ( 'external' === $type ) {
			$background_image = 'background-image: url(' . $external_img . ')';
			 $output = '<div class="issue_related_articles" data-link="' . $external_link . '">
						<div class="related_articles_bk" style="' . $background_image . '">
							<div class="related_articles_description" >
								<div class="related_articles_mobile_bk hidden-sm hidden-md hidden-lg" style="' . $background_image . '">
								</div>
								<h2>' . $external_title . '</h2>
								<div style="display:flex;align-items: center;justify-content:space-between;">
									<p style="width: 100%; border:0.5px solid"></p>
									
								</div>
								<p class="description">' . wp_trim_words( $external_preface, 110, '<a href="' . $external_link . '">[...]</a>' ) . '</p>
							</div>
						</div>
					</div>';
			return $output;
		} else {
			$post_obj = get_post( (int) $id );
			$post_thumbnail_url = str_replace( '/', '\\/', get_the_post_thumbnail_url( $id, 'large' ) );
			$background_image = 'background-image: url(' . $post_thumbnail_url . ')';
			// $user_obj = get_userdata( $post_obj->post_author );
			if ( $post_obj ) {
				$output = '<div class="issue_related_articles" data-link="' . $post_obj->guid . '">
							<div class="related_articles_bk" style="' . $background_image . '">
								<div class="related_articles_description" >
									<div class="related_articles_mobile_bk hidden-sm hidden-md hidden-lg" style="' . $background_image . '">
									</div>
									<h2>' . $post_obj->post_title . '</h2>
									<div style="display:flex;align-items: center;justify-content:space-between;">
										<p style="width: 75%; border:0.5px solid"></p>
										<p class="author">
										' . $user_obj->display_name . '
										<span class="date">' . date( 'Y/m/d',strtotime( $post_obj->post_date ) ) . '</span>
										</p>
									</div>
									<p class="description">' . wp_trim_words( $post_obj->post_excerpt, 110, '<a href="' . $post_obj->guid . '">[...]</a>' ) . '</p>
								</div>
							</div>
						</div>';
				return $output;
			}
		}
	}

	public function my_embed_callback( $atts, $content = null ) {
		if ( $content ) {
			global $wp_embed;
			return $wp_embed->run_shortcode( '[embed]' . $content . '[/embed]' );
		}
	}
}
