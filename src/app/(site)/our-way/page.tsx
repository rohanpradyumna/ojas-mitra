import type { Metadata } from 'next'
import Image from 'next/image'
import { PageIntro } from '@/components/ui/PageIntro'
import { Reveal } from '@/components/ui/Reveal'
import { TESTIMONIALS } from '@/data/site'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Our way',
  description:
    'On bio-enzymes, plant extracts, and the small kindnesses that go into every bottle of Ojas Mithra.',
}

export default function OurWayPage() {
  return (
    <>
      <PageIntro kicker="our way" title="A letter about how this is made." />
      <Image
        src="/svg/warli-tree.svg"
        alt=""
        width={80}
        height={80}
        unoptimized
        className={styles.tree}
      />

      <div className={styles.longform}>
        <p className={styles.first}>
          We are a small family enterprise in a village in Andhra Pradesh. The workshop is the back
          half of our house. The supply room is the room next to the kitchen. The clay pots in which
          we ferment the citrus peels sit in the shade of the courtyard, beside the tulsi and the
          curry-leaf tree.
        </p>
        <p>
          We started because Kavita’s mother, before she passed in 2022, asked her to do one more
          thing. She had spent a lifetime watching neighbours struggle with what they put in their
          water, on their floors, on their skin — bottles of chemicals their grandmothers wouldn’t
          have recognised, all priced affordably and sold without much thought. She knew her
          daughter could do better. <em>Make something for ordinary homes</em>, she said.{' '}
          <em>Make it so it is theirs.</em>
        </p>
        <p>
          So we did, slowly, while figuring out how. Kavita is a climate activist and a community
          psychologist; the work is hers, but it sits on top of a much larger one — the work that
          families in our part of India have always done to make do, to make clean, to make safe,
          without much help.
        </p>
        <blockquote className={styles.pull}>
          We do not make anything we would not pour into our own bucket, our own sink, our own
          hands.
        </blockquote>
        <p>
          The bottles in our catalogue are bio-enzyme based. That means the cleaning power comes
          from a quiet liquid we ferment from citrus peels — the same peels we used to throw away,
          and which our grandmothers would have known what to do with. They go into clay pots with
          jaggery and water, and they sit for ninety days in the shade. What comes out at the end is
          gently acidic, mildly cleansing, and alive with the kind of enzymes that food waste
          produces when given time. We blend this base with plant surfactants, essential oils, and
          small amounts of well-chosen things like neem and aloe.
        </p>
        <p>
          We do not test on animals. We do not use synthetic fragrance, synthetic colour, parabens,
          sulphates, optical brighteners, or anything that ends in a number we don’t recognise. We
          list every ingredient in plain words on the label and on the page. If you want to know
          more, write to us.
        </p>
        <p>
          The Kumkumadhi Tailam is the odd one out. It belongs to a different tradition entirely —
          the slow oil-based <em>tailams</em> of classical Ayurveda. We make it the way the old
          books describe, in small batches, in sesame oil, with saffron and sandalwood and fifteen
          other things. It is the bottle we are proudest of, and the one we make least of, because
          it takes the longest.
        </p>
        <blockquote className={styles.pull}>
          The recipes are old. The pace is slow. The promise is plain.
        </blockquote>
        <p>
          We pack everything ourselves. Every order is filled by hand, here, by Kavita or by one of
          the two women who help her — both from the same village, both paid the way we would want
          our daughters to be paid. We use cotton instead of bubble wrap. We re-use cardboard. We
          accept the bottle back when it is empty and refill it for less, if you are near enough to
          bring it.
        </p>
        <p>
          We have a WhatsApp number. We do not have a checkout, because we like to know who we are
          sending bottles to. Some orders take two days; some take a week, if Kavita is travelling
          for community work. We will tell you. We will answer.
        </p>
        <p>We are not in a hurry. We hope you aren’t either.</p>

        <dl className={styles.definitions}>
          <div>
            <dt>
              ojas <span className="deva">ओजस</span>
            </dt>
            <dd>
              In Ayurveda, <em>ojas</em> is the essence of vitality. The luminous, settled energy
              that a body has when it is well-cared-for, well-rested, well-fed. It is what the old
              physicians wished for their patients above any single cure.
            </dd>
          </div>
          <div>
            <dt>
              mithra <span className="deva">मित्र</span>
            </dt>
            <dd>
              <em>Mithra</em> is friend, in Sanskrit and in many Indian languages that came after
              it. To be a <em>mithra</em> is to be a companion through the ordinary days — through
              the dishes after dinner, the floor after the rain, the face at the end of a long week.
            </dd>
          </div>
        </dl>
      </div>

      <section className={styles.maker} aria-labelledby="maker-title">
        <Reveal className={styles.portrait}>
          <Image
            src="/images/kavita.png"
            alt="Kavita Ajay on her balcony"
            width={1350}
            height={1800}
            sizes="(max-width: 880px) 90vw, 30vw"
          />
          <span className={`handwriting ${styles.corner}`}>Kavita, ’26</span>
        </Reveal>
        <Reveal className={styles.makerText}>
          <p className="kicker">the maker</p>
          <h2 id="maker-title">A promise kept in a courtyard.</h2>
          <p>
            <em>Kavita Ajay</em> began Ojas Mithra in the courtyard of her own home. At forty-six,
            she has spent more than half her life among families and farms across south India — a
            climate activist by training, a community psychologist by listening, learning what
            people put in their hands and their water, and what they wished they could put instead.
          </p>
          <p>
            Every order is filled from her backyard. Nothing leaves the kitchen until it has been on
            the shelf long enough that we, the family, have used it ourselves.
          </p>
          <p className={`handwriting ${styles.sign}`}>with care, from our kitchen to yours.</p>
        </Reveal>
      </section>

      <section className={styles.letters} aria-labelledby="letters-title">
        <h2 id="letters-title" className={styles.lettersTitle}>
          People who took it home, writing back.
        </h2>
        <Reveal as="ul" className={styles.quotes} stagger={0.1}>
          {TESTIMONIALS.map((t) => (
            <li key={t.who}>
              <blockquote>
                <p>“{t.quote}”</p>
                <footer>
                  <cite>{t.who}</cite>
                  <span>{t.where}</span>
                </footer>
              </blockquote>
            </li>
          ))}
        </Reveal>
      </section>
    </>
  )
}
