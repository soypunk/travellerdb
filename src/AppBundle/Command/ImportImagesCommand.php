<?php

namespace AppBundle\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;

class ImportImagesCommand extends ContainerAwareCommand
{

	protected function configure()
	{
		$this
		->setName('app:import:images')
		->setDescription('Download missing card images from FFG websites')
		;
	}

	protected function execute(InputInterface $input, OutputInterface $output)
	{
		$assets_helper = $this->getContainer()->get('templating.helper.assets');

		/* @var $em \Doctrine\ORM\EntityManager */
		$em = $this->getContainer()->get('doctrine')->getManager();

		$rootDir = $this->getContainer()->get('kernel')->getRootDir();

		$cards = $em->getRepository('AppBundle:Card')->findBy([], ['code' => 'ASC']);
		/* @var \AppBundle\Entity\Card $card */
		foreach($cards as $card) {
			$card_code = $card->getCode();
			
//			if(!$card->getPack()->getDateRelease()) {
//				$output->writeln("Skip $card_code because it's not released");
//				continue;
//			}
			
			if(!$card->getPack()->getCgdbId()) {
				$output->writeln("Skip $card_code because its cgdb_id is not defined");
				continue;
			}
				
			$imageurl = $assets_helper->getUrl('bundles/cards/'.$card_code.'.png');
			$imagepath= $rootDir . '/../web' . preg_replace('/\?.*/', '', $imageurl);
			
			if(file_exists($imagepath)) {
				$output->writeln("Skip $card_code because it's already there");
			} else {
				$cgdbfile = sprintf('GT%02d_%d.jpg', $card->getPack()->getCgdbId(), $card->getPosition());
				$cgdburl = "http://lcg-cdn.fantasyflightgames.com/got2nd/" . $cgdbfile;

				$dirname = dirname($imagepath);
				$outputfile = $dirname . DIRECTORY_SEPARATOR . $card_code . ".jpg";

				$image = @file_get_contents($cgdburl);
				if($image !== FALSE) {
					file_put_contents($outputfile, $image);
					$output->writeln("New file at $outputfile");
				} else {
					$output->writeln("Failed at downloading $cgdburl");
				}
			}
		}
	}
}
