<?php 

namespace AppBundle\Repository;

class CardRepository extends TranslatableRepository
{
	function __construct($entityManager)
	{
		parent::__construct($entityManager, $entityManager->getClassMetadata('AppBundle\Entity\Card'));
	}

	public function findAll()
	{
		$qb = $this->createQueryBuilder('c')
			->select('c, t, f, p, y')
			->join('c.type', 't')
			->join('c.faction', 'f')
			->join('c.pack', 'p')
			->join('p.cycle', 'y')
			->orderBY('c.code', 'ASC');

		return $this->getResult($qb);
	}

	public function findByType($type)
	{
		$qb = $this->createQueryBuilder('c')
			->select('c, p')
			->join('c.pack', 'p')
			->join('c.type', 't')
			->andWhere('t.code = ?1')
			->orderBY('c.code', 'ASC');

		$qb->setParameter(1, $type);

		return $this->getResult($qb);
	}

	public function findByCode($code)
	{
		$qb = $this->createQueryBuilder('c')
			->select('c')
			->andWhere('c.code = ?1');

		$qb->setParameter(1, $code);

		return $this->getOneOrNullResult($qb);
	}

	public function findAllByCodes($codes)
	{
		$qb = $this->createQueryBuilder('c')
			->select('c, t, f, p, y')
			->join('c.type', 't')
			->join('c.faction', 'f')
			->join('c.pack', 'p')
			->join('p.cycle', 'y')
			->andWhere('c.code in (?1)')
			->orderBY('c.code', 'ASC');

		$qb->setParameter(1, $codes);

		return $this->getResult($qb);
	}

	public function findByRelativePosition($card, $position)
	{
		$qb = $this->createQueryBuilder('c')
			->select('c')
			->join('c.pack', 'p')
			->andWhere('p.code = ?1')
			->andWhere('c.position = ?2');

		$qb->setParameter(1, $card->getPack()->getCode());
		$qb->setParameter(2, $card->getPosition()+$position);

		return $this->getOneOrNullResult($qb);
	}

	public function findPreviousCard($card)
	{
		return $this->findByRelativePosition($card, -1);
	}

	public function findNextCard($card)
	{
		return $this->findByRelativePosition($card, 1);
	}

	public function findTraits()
	{
		$qb = $this->createQueryBuilder('c')
			->select('DISTINCT c.traits')
			->andWhere("c.traits != ''");
		return $this->getResult($qb);
	}
}
