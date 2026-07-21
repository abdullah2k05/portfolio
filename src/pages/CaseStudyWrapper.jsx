import { useParams } from 'react-router-dom';
import CaseStudyPage from '../components/CaseStudyPage';

export default function CaseStudyWrapper() {
  const { slug } = useParams();
  return <CaseStudyPage slug={slug} />;
}
