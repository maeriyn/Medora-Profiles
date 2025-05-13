from setuptools import setup, find_packages

setup(
    name="medora-client",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "fastapi>=0.68.0",
        "uvicorn>=0.15.0",
        "requests>=2.26.0",
        "python-dotenv>=0.19.0",
        "pydantic>=1.8.2",
    ],
    author="YC Demo Team",
    author_email="demo@example.com",
    description="A FastAPI wrapper for synthetic medical data generation",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/yourusername/medora-client",
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
    ],
    python_requires=">=3.8",
)