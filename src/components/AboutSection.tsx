import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

const AboutSection = () => {
  return (
    <Card className="my-8">
      <CardHeader>
        <CardTitle>About</CardTitle>
        <CardDescription>Musician, DJ, and visual artist</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Maxwell Young is a musician, DJ, and visual artist from Auckland, New
          Zealand. His music blends ambient sounds with heartfelt lyrics,
          creating a unique listening experience. Discover more about Maxwell's
          journey and latest projects on this site.
        </p>
      </CardContent>
      <CardFooter>
        <p>Stay tuned for more updates and new releases.</p>
      </CardFooter>
    </Card>
  );
};

export default AboutSection;
